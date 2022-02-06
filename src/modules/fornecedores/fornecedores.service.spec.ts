import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { Usuario } from '../usuario/usuario.entity';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { FindFornecedoresQueryDto } from './dto/find-fornecedores-query.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor-dto';
import { FornecedoresRepository } from './fornecedores.repository';
import { FornecedoresService } from './fornecedores.service';

const mockFornecedorRepository = () => ({
  createFornecedor: jest.fn(),
  findFornecedores: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('FornecedoresService', () => {
  let service: FornecedoresService;
  let fornecedorRepository: FornecedoresRepository;

  const mockUsuario = { id: 'mockId' } as Usuario;

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
        FornecedoresService,
        {
          provide: FornecedoresRepository,
          useFactory: mockFornecedorRepository,
        },
        {
          provide: EnderecoService,
          useValue: fakeEnderecoService,
        },
      ],
    }).compile();

    fornecedorRepository = await module.get<FornecedoresRepository>(
      FornecedoresRepository,
    );
    service = await module.get<FornecedoresService>(FornecedoresService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(fornecedorRepository).toBeDefined();
  });

  describe('Criar fornecedor', () => {
    let mockCreateFornecedorDto: CreateFornecedorDto;

    beforeEach(() => {
      mockCreateFornecedorDto = {
        nome: 'Teste',
        cpfCnpj: '1231321123',
        situacaoCadastral: 'regular',
        email: 'teste@example.com',
        empresa: { id: '5' } as Empresa,
      };
    });

    it('deve criar o fornecedor', async () => {
      (fornecedorRepository.createFornecedor as jest.Mock).mockResolvedValue(
        'mockFornecedor',
      );
      const result = await service.createFornecedor(mockCreateFornecedorDto);

      expect(fornecedorRepository.createFornecedor).toHaveBeenCalledWith(
        mockCreateFornecedorDto,
      );
      expect(result).toEqual('mockFornecedor');
    });
  });

  describe('Pesquisar fornecedor', () => {
    it('deve retornar o fornecedor encontrado', async () => {
      (fornecedorRepository.findOne as jest.Mock).mockResolvedValue(
        'mockFornecedor',
      );
      expect(fornecedorRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findFornecedorById('mockId');
      const relations = ['endereco'];
      expect(fornecedorRepository.findOne).toHaveBeenCalledWith('mockId', {
        relations,
      });
      expect(result).toEqual('mockFornecedor');
    });

    it('deve lançar um erro porque o fornecedor não foi encontrado', async () => {
      (fornecedorRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findFornecedorById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar fornecedores', () => {
    it('deve chamar o método findFornecedores do fornecedorRepository', async () => {
      (fornecedorRepository.findFornecedores as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindFornecedoresQueryDto: FindFornecedoresQueryDto = {
        nome: '',
        email: '',
        limit: 1,
        page: 1,
        sort: '',
      };

      const result = await service.findFornecedores(
        mockFindFornecedoresQueryDto,
        'mockIdEmpresa',
      );
      expect(fornecedorRepository.findFornecedores).toHaveBeenCalledWith(
        mockFindFornecedoresQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar fornecedor', () => {
    let mockUpdateFornecedorDto: UpdateFornecedorDto;

    beforeEach(() => {
      mockUpdateFornecedorDto = {
        nome: 'Teste',
        email: 'teste2@example.com',
      };
    });

    it('deve retornar afetado > 0 se os dados do fornecedor forem atualizados e retornar os novos dados', async () => {
      (fornecedorRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (fornecedorRepository.findOne as jest.Mock).mockResolvedValue(
        'mockFornecedor',
      );

      const result = await service.updateFornecedor(
        mockUpdateFornecedorDto,
        'mockId',
        mockUsuario,
      );

      expect(fornecedorRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateFornecedorDto,
      );
      expect(result).toEqual('mockFornecedor');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (fornecedorRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateFornecedor(
          mockUpdateFornecedorDto,
          'mockId',
          mockUsuario,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletar forneceodr', () => {
    it('deve retornar afetado > 0 se o fornecedor for excluído', async () => {
      (fornecedorRepository.findOne as jest.Mock).mockResolvedValue(
        'mockFornecedor',
      );
      expect(fornecedorRepository.findOne).not.toHaveBeenCalled();

      (fornecedorRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteFornecedor('mockId');
      expect(fornecedorRepository.delete).toHaveBeenCalledWith({
        id: 'mockId',
      });
    });

    it('deve lançar um erro se nenhum fornecedor for excluído', async () => {
      (fornecedorRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteFornecedor('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
