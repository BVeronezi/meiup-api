import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Produtos } from '../produtos/produtos.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { Vendas } from '../vendas/vendas.entity';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutoVendaDto } from './dto/produto-venda-dto';
import { ProdutosVendaRepository } from './produtos_venda.repository';
import { ProdutosVendaService } from './produtos_venda.service';

const mockProdutosVendaRepository = () => ({
  findProdutosVenda: jest.fn(),
  findOne: jest.fn(),
  createProdutoVenda: jest.fn(),
  updateProdutoVenda: jest.fn(),
  delete: jest.fn(),
});

describe('ProdutosServicoService', () => {
  let service: ProdutosVendaService;
  let produtoVendaRepository: ProdutosVendaRepository;

  const mockProdutoVendaDto: ProdutoVendaDto = {
    produto: {
      descricao: 'Produto teste',
      tipoItem: 1,
      unidade: 2,
    } as Produtos,
    quantidade: 10,
    precoUnitario: 2.99,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosVendaService,
        {
          provide: ProdutosVendaRepository,
          useFactory: mockProdutosVendaRepository,
        },
        {
          provide: ProdutosService,
          useValue: fakeProdutoService,
        },
      ],
    }).compile();

    produtoVendaRepository = await module.get<ProdutosVendaRepository>(
      ProdutosVendaRepository,
    );
    service = await module.get<ProdutosVendaService>(ProdutosVendaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(produtoVendaRepository).toBeDefined();
  });

  describe('Criar produto venda', () => {
    it('deve criar o produto venda', async () => {
      (
        produtoVendaRepository.createProdutoVenda as jest.Mock
      ).mockResolvedValue('mockProdutoVenda');
      const result = await service.createProdutoVenda(mockProdutoVendaDto);

      expect(produtoVendaRepository.createProdutoVenda).toHaveBeenCalledWith(
        mockProdutoVendaDto,
      );
      expect(result).toEqual('mockProdutoVenda');
    });
  });

  describe('Pesquisar produto venda', () => {
    it('deve retornar o produto venda encontrado', async () => {
      (produtoVendaRepository.findOne as jest.Mock).mockResolvedValue(
        'mockProdutoVenda',
      );
      expect(produtoVendaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findProdutosVendaById(
        'mockIdVenda',
        'mockIdProduto',
      );
      expect(produtoVendaRepository.findOne).toHaveBeenCalledWith({
        where: {
          venda: 'mockIdVenda',
          produto: 'mockIdProduto',
        },
      });
      expect(result).toEqual('mockProdutoVenda');
    });
  });

  describe('Pesquisar produtos vendas', () => {
    it('deve chamar o método findProdutosVenda do produtoVendaRepository', async () => {
      (produtoVendaRepository.findProdutosVenda as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindProdutosQueryDto: FindProdutosVendasQueryDto = {
        vendaId: 10,
      };

      const result = await service.findProdutosVenda(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(produtoVendaRepository.findProdutosVenda).toHaveBeenCalledWith(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });
});
