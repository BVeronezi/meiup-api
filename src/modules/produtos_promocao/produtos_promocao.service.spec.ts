import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Produtos } from '../produtos/produtos.entity';
import { Promocoes } from '../promocoes/promocoes.entity';
import { FindProdutosPromocaoQueryDto } from './dto/find-produtos-promocao-dto';
import { ProdutoPromocaoDto } from './dto/produtos-promoca-dto';
import { ProdutosPromocaoRepository } from './produtos_promocao.repository';
import { ProdutosPromocaoService } from './produtos_promocao.service';

const mockProdutosPromocaoRepository = () => ({
  findProdutosPromocao: jest.fn(),
  findOne: jest.fn(),
  createProdutoPromocao: jest.fn(),
  updateProdutoPromocao: jest.fn(),
  delete: jest.fn(),
});

describe('ProdutosPromocaoService', () => {
  let service: ProdutosPromocaoService;
  let produtoPromocaoRepository: ProdutosPromocaoRepository;

  const mockProdutoPromocaoDto: ProdutoPromocaoDto = {
    produto: {
      descricao: 'Produto teste',
      tipoItem: 1,
      unidade: 2,
    } as Produtos,
    precoPromocional: 2.99,
    promocao: {
      id: '5',
    } as Promocoes,
    empresa: { id: '5' } as Empresa,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosPromocaoService,
        {
          provide: ProdutosPromocaoRepository,
          useFactory: mockProdutosPromocaoRepository,
        },
      ],
    }).compile();

    produtoPromocaoRepository = await module.get<ProdutosPromocaoRepository>(
      ProdutosPromocaoRepository,
    );
    service = await module.get<ProdutosPromocaoService>(
      ProdutosPromocaoService,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(produtoPromocaoRepository).toBeDefined();
  });

  describe('Criar produto promoção', () => {
    it('deve criar o produto promoção', async () => {
      (
        produtoPromocaoRepository.createProdutoPromocao as jest.Mock
      ).mockResolvedValue('mockProdutoPromocao');
      const result = await service.createProdutoPromocao(
        mockProdutoPromocaoDto,
      );

      expect(
        produtoPromocaoRepository.createProdutoPromocao,
      ).toHaveBeenCalledWith(mockProdutoPromocaoDto);
      expect(result).toEqual('mockProdutoPromocao');
    });
  });

  describe('Pesquisar produto promoção', () => {
    it('deve retornar o produto promoção encontrado', async () => {
      (produtoPromocaoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockProdutoPromocao',
      );
      expect(produtoPromocaoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findProdutosPromocaoById(
        'mockIdPromocao',
        'mockIdProduto',
      );
      expect(produtoPromocaoRepository.findOne).toHaveBeenCalledWith({
        where: {
          promocao: 'mockIdPromocao',
          produto: 'mockIdProduto',
        },
      });
      expect(result).toEqual('mockProdutoPromocao');
    });
  });

  describe('Pesquisar produtos promoção', () => {
    it('deve chamar o método findProdutosPromocao do produtoPromocaoRepository', async () => {
      (
        produtoPromocaoRepository.findProdutosPromocao as jest.Mock
      ).mockResolvedValue('resultOfsearch');
      const mockFindProdutosQueryDto: FindProdutosPromocaoQueryDto = {
        promocaoId: 'mockId',
      };

      const result = await service.findProdutosPromocao(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(
        produtoPromocaoRepository.findProdutosPromocao,
      ).toHaveBeenCalledWith(mockFindProdutosQueryDto, 'mockIdEmpresa');
      expect(result).toEqual('resultOfsearch');
    });
  });
});
