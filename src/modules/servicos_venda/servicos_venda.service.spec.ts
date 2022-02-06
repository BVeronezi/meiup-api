import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { Vendas } from '../vendas/vendas.entity';
import { ServicosVendaRepository } from './servicos_venda.repository';
import { ServicosVendaService } from './servicos_venda.service';
import { ServicoVendaDto } from './dto/servico-venda-dto';
import { Servicos } from '../servicos/servicos.entity';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';

const mockServicosVendaRepository = () => ({
  findServicosVenda: jest.fn(),
  createServicosVenda: jest.fn(),
  updateServicoVenda: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('ServicosVendaService', () => {
  let service: ServicosVendaService;
  let servicoVendaRepository: ServicosVendaRepository;

  const mockServicoVendaDto: ServicoVendaDto = {
    servico: {
      nome: 'Produto teste',
    } as Servicos,
    valorServico: 2.99,
    outrasDespesas: 0,
    desconto: 0,
    valorTotal: 100,
    venda: {
      id: '5',
      valorTotal: 100,
      pagamento: 120,
      valorTroco: 20,
    } as Vendas,
    empresa: { id: '5' } as Empresa,
  };

  const fakeProdutoService: Partial<ProdutosService> = {
    findProdutoById: jest.fn(),
  };

  const fakeProdutoServicoService: Partial<ProdutosServicoService> = {
    findProdutosServico: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosVendaService,
        {
          provide: ServicosVendaRepository,
          useFactory: mockServicosVendaRepository,
        },
        {
          provide: ProdutosService,
          useValue: fakeProdutoService,
        },
        {
          provide: ProdutosServicoService,
          useValue: fakeProdutoServicoService,
        },
      ],
    }).compile();

    servicoVendaRepository = await module.get<ServicosVendaRepository>(
      ServicosVendaRepository,
    );
    service = await module.get<ServicosVendaService>(ServicosVendaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(servicoVendaRepository).toBeDefined();
  });

  describe('Criar servico venda', () => {
    it('deve criar o servico venda', async () => {
      (
        servicoVendaRepository.createServicosVenda as jest.Mock
      ).mockResolvedValue('mockServicoVenda');
      const result = await service.createServicoVenda(mockServicoVendaDto);

      expect(servicoVendaRepository.createServicosVenda).toHaveBeenCalledWith(
        mockServicoVendaDto,
      );
      expect(result).toEqual('mockServicoVenda');
    });
  });

  describe('Pesquisar servico venda', () => {
    it('deve retornar o servico venda encontrado', async () => {
      (servicoVendaRepository.findOne as jest.Mock).mockResolvedValue(
        'mockServicoVenda',
      );
      expect(servicoVendaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findProdutosVendaById(
        'mockIdVenda',
        'mockIdServico',
      );
      expect(servicoVendaRepository.findOne).toHaveBeenCalledWith({
        where: {
          venda: 'mockIdVenda',
          servico: 'mockIdServico',
        },
      });
      expect(result).toEqual('mockServicoVenda');
    });
  });

  describe('Pesquisar servicos vendas', () => {
    it('deve chamar o método findServicosVenda do servicoVendaRepository', async () => {
      (servicoVendaRepository.findServicosVenda as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindServicosQueryDto: FindServicosVendasQueryDto = {
        vendaId: 10,
      };

      const result = await service.findServicosVenda(
        mockFindServicosQueryDto,
        'mockIdEmpresa',
      );
      expect(servicoVendaRepository.findServicosVenda).toHaveBeenCalledWith(
        mockFindServicosQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });
});
