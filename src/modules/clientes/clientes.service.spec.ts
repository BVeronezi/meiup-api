import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { Usuario } from '../usuario/usuario.entity';
import { ClientesRepository } from './clientes.repository';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { FindClientesQueryDto } from './dto/find-clientes-query.dto';
import { UpdateClienteDto } from './dto/update-cliente-dto';

const mockClienteRepository = () => ({
  createCliente: jest.fn(),
  findClientes: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ClientesService', () => {
  let service: ClientesService;
  let clienteRepository: ClientesRepository;

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
        ClientesService,
        {
          provide: ClientesRepository,
          useFactory: mockClienteRepository,
        },
        {
          provide: EnderecoService,
          useValue: fakeEnderecoService,
        },
      ],
    }).compile();

    clienteRepository = await module.get<ClientesRepository>(
      ClientesRepository,
    );
    service = await module.get<ClientesService>(ClientesService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(clienteRepository).toBeDefined();
  });

  describe('Criar cliente', () => {
    let mockCreateClienteDto: CreateClienteDto;

    beforeEach(() => {
      mockCreateClienteDto = {
        nome: 'Teste',
        email: 'teste@example.com',
        empresa: { id: '5' } as Empresa,
      };
    });

    it('deve criar o cliente', async () => {
      (clienteRepository.createCliente as jest.Mock).mockResolvedValue(
        'mockCliente',
      );
      const result = await service.createCliente(
        mockCreateClienteDto,
        mockCreateClienteDto.empresa,
      );

      expect(clienteRepository.createCliente).toHaveBeenCalledWith(
        mockCreateClienteDto,
      );
      expect(result).toEqual('mockCliente');
    });
  });

  describe('Pesquisar cliente', () => {
    it('deve retornar o cliente encontrado', async () => {
      (clienteRepository.findOne as jest.Mock).mockResolvedValue('mockCliente');
      expect(clienteRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findClienteById('mockId');
      const relations = ['endereco'];
      expect(clienteRepository.findOne).toHaveBeenCalledWith('mockId', {
        relations,
      });
      expect(result).toEqual('mockCliente');
    });

    it('deve lançar um erro porque o cliente não foi encontrado', async () => {
      (clienteRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findClienteById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar clientes', () => {
    it('deve chamar o método findClientes do clienteRepository', async () => {
      (clienteRepository.findClientes as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindClientesQueryDto: FindClientesQueryDto = {
        nome: '',
        email: '',
        limit: 1,
        page: 1,
        sort: '',
      };

      const result = await service.findClientes(
        mockFindClientesQueryDto,
        'mockIdEmpresa',
      );
      expect(clienteRepository.findClientes).toHaveBeenCalledWith(
        mockFindClientesQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar cliente', () => {
    let mockUpdateClienteDto: UpdateClienteDto;

    beforeEach(() => {
      mockUpdateClienteDto = {
        nome: 'Teste',
        email: 'teste2@example.com',
      };
    });

    it('deve retornar afetado > 0 se os dados do cliente forem atualizados e retornar os novos dados', async () => {
      (clienteRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (clienteRepository.findOne as jest.Mock).mockResolvedValue('mockCliente');

      const result = await service.updateCliente(
        mockUpdateClienteDto,
        'mockId',
        mockUsuario,
      );

      expect(clienteRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateClienteDto,
      );
      expect(result).toEqual('mockCliente');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (clienteRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateCliente(mockUpdateClienteDto, 'mockId', mockUsuario),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletar cliente', () => {
    it('deve retornar afetado > 0 se o cliente for excluído', async () => {
      (clienteRepository.findOne as jest.Mock).mockResolvedValue('mockCliente');
      expect(clienteRepository.findOne).not.toHaveBeenCalled();

      (clienteRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteCliente('mockId');
      expect(clienteRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhum cliente for excluído', async () => {
      (clienteRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteCliente('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
