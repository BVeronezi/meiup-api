import { Test, TestingModule } from '@nestjs/testing';
import { Categorias } from '../categorias/categorias.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Precos } from '../precos/precos.entity';
import { Produtos } from '../produtos/produtos.entity';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { Servicos } from '../servicos/servicos.entity';
import { FindProdutosServicoQueryDto } from './dto/find-produtos-servico-dto';
import { ProdutoServicoDto } from './dto/produto-servico-dto';
import { ProdutosServicoRepository } from './produtos_servico.repository';

const mockProdutoServicoRepository = () => ({
  findProdutosServico: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  createProdutoServico: jest.fn(),
  updateProdutoServico: jest.fn(),
  delete: jest.fn(),
});

describe('ProdutosServicoService', () => {
  let service: ProdutosServicoService;
  let produtoServicoRepository: ProdutosServicoRepository;

  const mockCreateProdutoServicoDto: ProdutoServicoDto = {
    produto: {
      descricao: 'Produto teste',
      tipoItem: 1,
      unidade: 2,
      categoria: { id: '1', nome: 'Categoria Teste' } as Categorias,
      precos: {
        precoVendaVarejo: 4.0,
        precoVendaAtacado: 2.0,
        precoCompra: 1.0,
        margemLucro: 3.0,
      } as Precos,
    } as Produtos,
    quantidade: 10,
    empresa: { id: '5' } as Empresa,
    servico: {
      nome: 'Serviço teste',
      custo: 10,
      valor: 20,
      margemLucro: 10,
    } as Servicos,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosServicoService,
        {
          provide: ProdutosServicoRepository,
          useFactory: mockProdutoServicoRepository,
        },
      ],
    }).compile();

    produtoServicoRepository = await module.get<ProdutosServicoRepository>(
      ProdutosServicoRepository,
    );
    service = await module.get<ProdutosServicoService>(ProdutosServicoService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(produtoServicoRepository).toBeDefined();
  });

  describe('Criar produto serviço', () => {
    it('deve criar o produto serviço', async () => {
      (
        produtoServicoRepository.createProdutoServico as jest.Mock
      ).mockResolvedValue('mockProdutoServico');
      const result = await service.createProdutoServico(
        mockCreateProdutoServicoDto,
      );

      expect(
        produtoServicoRepository.createProdutoServico,
      ).toHaveBeenCalledWith(mockCreateProdutoServicoDto);
      expect(result).toEqual('mockProdutoServico');
    });
  });

  describe('Pesquisar produto serviço', () => {
    it('deve retornar o produto serviço encontrado', async () => {
      (produtoServicoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockProdutoServico',
      );
      expect(produtoServicoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findProdutosServicoById(
        'mockIdServico',
        'mockIdProduto',
      );
      expect(produtoServicoRepository.findOne).toHaveBeenCalledWith({
        where: {
          servico: 'mockIdServico',
          produto: 'mockIdProduto',
        },
      });
      expect(result).toEqual('mockProdutoServico');
    });
  });

  describe('Pesquisar produtos serviços', () => {
    it('deve chamar o método findProdutosServico do produtoServicoRepository', async () => {
      (
        produtoServicoRepository.findProdutosServico as jest.Mock
      ).mockResolvedValue('resultOfsearch');
      const mockFindProdutosQueryDto: FindProdutosServicoQueryDto = {
        servicoId: '10',
      };

      const result = await service.findProdutosServico(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(produtoServicoRepository.findProdutosServico).toHaveBeenCalledWith(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });
});
