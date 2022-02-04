import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Clientes } from '../clientes/clientes.entity';
import { ClientesService } from '../clientes/clientes.service';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { ProdutosVendaService } from '../produtos_venda/produtos_venda.service';
import { ServicosService } from '../servicos/servicos.service';
import { ServicosVendaService } from '../servicos_venda/servicos_venda.service';
import { Usuario } from '../usuario/usuario.entity';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { VendasRepository } from './vendas.repository';
import { VendasService } from './vendas.service';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { StatusVenda } from './enum/venda-status.enum';

const mockVendaRepository = () => ({
  createVenda: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  findVendas: jest.fn(),
});

describe('VendasService', () => {
  let service: VendasService;
  let vendaRepository: VendasRepository;

  const mockEmpresa = { id: '5' } as Empresa;
  const mockUsuario = { id: '1' } as Usuario;

  const fakeClienteService: Partial<ClientesService> = {
    findClienteById: jest.fn(),
  };

  const fakeProdutoService: Partial<ProdutosService> = {
    findProdutoById: jest.fn(),
  };

  const fakeServicoService: Partial<ServicosService> = {
    findServicoById: jest.fn(),
  };

  const fakeProdutoVendaService: Partial<ProdutosVendaService> = {
    findProdutosVenda: jest.fn(),
    findProdutosVendaById: jest.fn(),
    createProdutoVenda: jest.fn(),
    updateProdutoVenda: jest.fn(),
  };

  const fakeServicoVendaService: Partial<ServicosVendaService> = {
    findServicosVenda: jest.fn(),
    findProdutosVendaById: jest.fn(),
    createServicoVenda: jest.fn(),
    updateServicoVenda: jest.fn(),
  };

  const fakeProdutoServicoService: Partial<ProdutosServicoService> = {
    findProdutosServico: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendasService,
        {
          provide: VendasRepository,
          useFactory: mockVendaRepository,
        },
        {
          provide: ClientesService,
          useValue: fakeClienteService,
        },
        {
          provide: ProdutosService,
          useValue: fakeProdutoService,
        },
        {
          provide: ServicosService,
          useValue: fakeServicoService,
        },
        {
          provide: ProdutosVendaService,
          useValue: fakeProdutoVendaService,
        },
        {
          provide: ServicosVendaService,
          useValue: fakeServicoVendaService,
        },
        {
          provide: ProdutosServicoService,
          useValue: fakeProdutoServicoService,
        },
      ],
    }).compile();

    vendaRepository = await module.get<VendasRepository>(VendasRepository);
    service = await module.get<VendasService>(VendasService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(vendaRepository).toBeDefined();
  });

  describe('Criar venda', () => {
    let mockCreateVendaDto: CreateVendaDto;

    beforeEach(() => {
      mockCreateVendaDto = {
        cliente: { id: '1', nome: 'Cliente Teste' } as Clientes,
        produtos: [{ id: 1, descricao: 'Produto Teste' }],
        dataVenda: new Date(),
        valorTotal: 100,
        pagamento: 100,
        valorTroco: 0,
        empresa: mockEmpresa,
        usuario: mockUsuario,
      };
    });

    it('deve criar a venda', async () => {
      (vendaRepository.createVenda as jest.Mock).mockResolvedValue('mockVenda');
      const result = await service.createVenda(mockCreateVendaDto);

      expect(vendaRepository.createVenda).toHaveBeenCalledWith(
        mockCreateVendaDto,
      );
      expect(result).toEqual('mockVenda');
    });
  });

  describe('Pesquisar venda', () => {
    it('deve retornar a venda encontrada', async () => {
      (vendaRepository.findOne as jest.Mock).mockResolvedValue('mockVenda');
      expect(vendaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findVendaById(1);
      expect(vendaRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual('mockVenda');
    });

    it('deve lançar um erro porque a venda não foi encontrada', async () => {
      (vendaRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findVendaById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Pesquisar usuários', () => {
    it('deve chamar o método findVendas do vendaRepository', async () => {
      (vendaRepository.findVendas as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindVendaQueryDto: FindVendasQueryDto = {
        cliente: 'Cliente teste',
      };

      const result = await service.findVendas(
        mockFindVendaQueryDto,
        'mockIdEmpresa',
      );
      expect(vendaRepository.findVendas).toHaveBeenCalledWith(
        mockFindVendaQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar venda', () => {
    let mockUpdateVendaDto: UpdateVendaDto;

    beforeEach(() => {
      mockUpdateVendaDto = {
        valorTotal: 100,
        pagamento: 100,
        valorTroco: 0,
      };
    });

    it('deve retornar afetado > 0 se os dados da venda forem atualizados e retornar os novos dados', async () => {
      (vendaRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      (vendaRepository.findOne as jest.Mock).mockResolvedValue('mockVenda');
      expect(vendaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.updateVenda(mockUpdateVendaDto, 'mockId');

      expect(vendaRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateVendaDto,
      );
      expect(result).toMatchObject({
        venda: 'mockVenda',
        message: 'Venda atualizada com sucesso',
      });
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (vendaRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.updateVenda(mockUpdateVendaDto, 'mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Finalizar venda', () => {
    it('deve retornar erro se venda cancelada', async () => {
      const mockVenda = {
        valorTotal: 100,
        pagamento: 100,
        valorTroco: 0,
        status: StatusVenda.CANCELADA,
      };

      (vendaRepository.findOne as jest.Mock).mockResolvedValue(mockVenda);
      expect(service.finalizaVenda(1)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro se venda já finalizada', async () => {
      const mockVenda = {
        valorTotal: 100,
        pagamento: 100,
        valorTroco: 0,
        status: StatusVenda.FINALIZADA,
      };

      (vendaRepository.findOne as jest.Mock).mockResolvedValue(mockVenda);
      expect(service.finalizaVenda(1)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro se venda sem valor', async () => {
      const mockVenda = {
        valorTotal: 0,
        pagamento: 0,
        valorTroco: 0,
        status: StatusVenda.ABERTA,
      };

      (vendaRepository.findOne as jest.Mock).mockResolvedValue(mockVenda);
      expect(service.finalizaVenda(1)).rejects.toThrow(BadRequestException);
    });
  });
});
