import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Produtos } from '../produtos/produtos.entity';
import { ProdutosFornecedoresRepository } from './produtos_fornecedores.repository';
import { ProdutosFornecedoresService } from './produtos_fornecedores.service';
import { ProdutoFornecedorDto } from './dto/produto-fornecedor-dto';
import { Fornecedores } from '../fornecedores/fornecedores.entity';
import { FindProdutosFornecedoresQueryDto } from './dto/find-produtos-fornecedores-dto';

const mockProdutoFornecedoresRepository = () => ({
  findProdutosFornecedores: jest.fn(),
  findOne: jest.fn(),
  createProdutoFornecedor: jest.fn(),
  delete: jest.fn(),
});

describe('ProdutosFornecedoresService', () => {
  let service: ProdutosFornecedoresService;
  let produtoFornecedoresRepository: ProdutosFornecedoresRepository;

  const mockProdutoPromocaoDto: ProdutoFornecedorDto = {
    produto: {
      descricao: 'Produto teste',
      tipoItem: 1,
      unidade: 2,
    } as Produtos,
    fornecedor: {
      id: '5',
      nome: 'Fornecedor teste',
    } as Fornecedores,
    empresa: { id: '5' } as Empresa,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosFornecedoresService,
        {
          provide: ProdutosFornecedoresRepository,
          useFactory: mockProdutoFornecedoresRepository,
        },
      ],
    }).compile();

    produtoFornecedoresRepository =
      await module.get<ProdutosFornecedoresRepository>(
        ProdutosFornecedoresRepository,
      );
    service = await module.get<ProdutosFornecedoresService>(
      ProdutosFornecedoresService,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(produtoFornecedoresRepository).toBeDefined();
  });

  describe('Criar produto fornecedor', () => {
    it('deve criar o produto fornecedor', async () => {
      (
        produtoFornecedoresRepository.createProdutoFornecedor as jest.Mock
      ).mockResolvedValue('mockProdutoFornecedor');
      const result = await service.createProdutoFornecedor(
        mockProdutoPromocaoDto,
      );

      expect(
        produtoFornecedoresRepository.createProdutoFornecedor,
      ).toHaveBeenCalledWith(mockProdutoPromocaoDto);
      expect(result).toEqual('mockProdutoFornecedor');
    });
  });

  describe('Pesquisar produto fornecedor', () => {
    it('deve retornar o produto fornecedor encontrado', async () => {
      (produtoFornecedoresRepository.findOne as jest.Mock).mockResolvedValue(
        'mockProdutoFornecedor',
      );
      expect(produtoFornecedoresRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findProdutosFornecedorById(
        'mockIdProduto',
        'mockIdFornecedor',
      );
      expect(produtoFornecedoresRepository.findOne).toHaveBeenCalledWith({
        where: {
          produto: 'mockIdProduto',
          fornecedor: 'mockIdFornecedor',
        },
      });
      expect(result).toEqual('mockProdutoFornecedor');
    });
  });

  describe('Pesquisar produtos fornecedor', () => {
    it('deve chamar o método findProdutosFornecedores do produtoFornecedoresRepository', async () => {
      (
        produtoFornecedoresRepository.findProdutosFornecedores as jest.Mock
      ).mockResolvedValue('resultOfsearch');
      const mockFindProdutosQueryDto: FindProdutosFornecedoresQueryDto = {
        produtoId: 'mockId',
      };

      const result = await service.findProdutosFornecedor(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(
        produtoFornecedoresRepository.findProdutosFornecedores,
      ).toHaveBeenCalledWith(mockFindProdutosQueryDto, 'mockIdEmpresa');
      expect(result).toEqual('resultOfsearch');
    });
  });
});
