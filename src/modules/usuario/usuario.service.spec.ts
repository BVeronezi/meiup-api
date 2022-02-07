import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindUsuariosQueryDto } from './dto/find-usuarios-query.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from './enum/user-roles.enum';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';

const mockUsuarioRepository = () => ({
  createUser: jest.fn(),
  creteUserSocial: jest.fn(),
  findOne: jest.fn(),
  findUsers: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: UsuarioRepository;

  const fakeEnderecoService: Partial<EnderecoService> = {
    updateOrCreateEndereco: () =>
      Promise.resolve({
        cep: '',
        endereco: '',
        estado: '',
        numero: '',
        bairro: '',
        cidade: '',
        complemento: '',
      } as Endereco),
    deleteEndereco: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: UsuarioRepository,
          useFactory: mockUsuarioRepository,
        },
        {
          provide: EnderecoService,
          useValue: fakeEnderecoService,
        },
      ],
    }).compile();

    usuarioRepository = await module.get<UsuarioRepository>(UsuarioRepository);
    service = await module.get<UsuarioService>(UsuarioService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(usuarioRepository).toBeDefined();
  });

  describe('Criar usuário', () => {
    let mockCreateUsuarioDto: CreateUsuarioDto;

    beforeEach(() => {
      mockCreateUsuarioDto = {
        nome: 'Teste',
        email: 'teste@example.com',
        empresa: { id: '5' } as Empresa,
        tipo: TipoUsuario.MEI,
        senha: '123456',
      };
    });

    it('deve criar o usuário', async () => {
      (usuarioRepository.createUser as jest.Mock).mockResolvedValue(
        'mockUsuario',
      );
      const result = await service.createUser(mockCreateUsuarioDto);

      expect(usuarioRepository.createUser).toHaveBeenCalledWith(
        mockCreateUsuarioDto,
        TipoUsuario.MEI,
      );
      expect(result).toEqual('mockUsuario');
    });
  });

  describe('Pesquisar usuário', () => {
    it('deve retornar o usuário encontrado', async () => {
      (usuarioRepository.findOne as jest.Mock).mockResolvedValue('mockUsuario');
      expect(usuarioRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findUserById('mockId');
      expect(usuarioRepository.findOne).toHaveBeenCalledWith('mockId', {
        select: ['email', 'nome', 'tipo', 'id'],
      });
      expect(result).toEqual('mockUsuario');
    });

    it('deve lançar um erro porque o usuário não foi encontrado', async () => {
      (usuarioRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findUserById('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Pesquisar usuários', () => {
    it('deve chamar o método findUsers do usuarioRepository', async () => {
      (usuarioRepository.findUsers as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindUsuariosQueryDto: FindUsuariosQueryDto = {
        nome: '',
        email: '',
        limit: 1,
        page: 1,
        sort: '',
      };

      const result = await service.findUsers(
        mockFindUsuariosQueryDto,
        'mockIdEmpresa',
      );
      expect(usuarioRepository.findUsers).toHaveBeenCalledWith(
        mockFindUsuariosQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar usuário', () => {
    let mockUpdateUsuarioDto: UpdateUsuarioDto;

    beforeEach(() => {
      mockUpdateUsuarioDto = {
        nome: 'Teste',
        email: 'teste2@example.com',
        celular: 31994411234,
        telefone: 3130161234,
        tipo: TipoUsuario.MEI,
      };
    });

    it('deve retornar afetado > 0 se os dados do usuário forem atualizados e retornar os novos dados', async () => {
      (usuarioRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (usuarioRepository.findOne as jest.Mock).mockResolvedValue('mockUsuario');

      const result = await service.updateUser(mockUpdateUsuarioDto, 'mockId');

      expect(usuarioRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateUsuarioDto,
      );
      expect(result).toEqual('mockUsuario');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (usuarioRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateUser(mockUpdateUsuarioDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletar usuário', () => {
    it('deve retornar afetado > 0 se o usuário for excluído', async () => {
      (usuarioRepository.findOne as jest.Mock).mockResolvedValue('mockUsuario');
      expect(usuarioRepository.findOne).not.toHaveBeenCalled();

      (usuarioRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteUser('mockId');
      expect(usuarioRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhum usuário for excluído', async () => {
      (usuarioRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteUser('mockId')).rejects.toThrow(NotFoundException);
    });
  });
});
