import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Categorias } from '../categorias/categorias.entity';
import { Empresa } from '../empresa/empresa.entity';
import { FornecedoresService } from '../fornecedores/fornecedores.service';
import { Precos } from '../precos/precos.entity';
import { PrecosService } from '../precos/precos.service';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { UpdateProdutoDto } from './dto/update-produto-dto';
import { ProdutosRepository } from './produtos.repository';
import { ProdutosService } from './produtos.service';

const mockProdutoRepository = () => ({
  createProduto: jest.fn(),
  findOne: jest.fn(),
  findProdutos: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProdutosService', () => {
  let service: ProdutosService;
  let produtoRepository: ProdutosRepository;

  const fakePrecosService: Partial<PrecosService> = {
    updateOrCreatePrecos: () =>
      Promise.resolve({
        precoVendaVarejo: 4.0,
        precoVendaAtacado: 2.0,
        precoCompra: 1.0,
        margemLucro: 3.0,
      } as Precos),
    deletePreco: jest.fn(),
  };

  const fakeFornecedoresService: Partial<FornecedoresService> = {
    findFornecedorById: jest.fn(),
  };

  const fakeProdutoServicoService: Partial<ProdutosServicoService> = {
    findProduto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: ProdutosRepository,
          useFactory: mockProdutoRepository,
        },
        {
          provide: PrecosService,
          useValue: fakePrecosService,
        },
        {
          provide: FornecedoresService,
          useValue: fakeFornecedoresService,
        },
        {
          provide: ProdutosServicoService,
          useValue: fakeProdutoServicoService,
        },
      ],
    }).compile();

    produtoRepository = await module.get<ProdutosRepository>(
      ProdutosRepository,
    );
    service = await module.get<ProdutosService>(ProdutosService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(produtoRepository).toBeDefined();
  });

  describe('Criar produto', () => {
    let mockCreateProdutoDto: CreateProdutoDto;

    beforeEach(() => {
      mockCreateProdutoDto = {
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
        empresa: { id: '5' } as Empresa,
      };
    });

    it('deve criar o produto', async () => {
      (produtoRepository.createProduto as jest.Mock).mockResolvedValue(
        'mockProduto',
      );
      const result = await service.createProduto(mockCreateProdutoDto);

      expect(produtoRepository.createProduto).toHaveBeenCalledWith(
        mockCreateProdutoDto,
      );
      expect(result).toEqual('mockProduto');
    });
  });

  describe('Pesquisar produto', () => {
    it('deve retornar o produto encontrado', async () => {
      (produtoRepository.findOne as jest.Mock).mockResolvedValue('mockProduto');
      expect(produtoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findProdutoById('mockId');
      expect(produtoRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockProduto');
    });

    it('deve lançar um erro porque o produto não foi encontrado', async () => {
      (produtoRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findProdutoById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar produtos', () => {
    it('deve chamar o método findProdutos do produtoRepository', async () => {
      (produtoRepository.findProdutos as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindProdutosQueryDto: FindProdutosQueryDto = {
        descricao: 'Produto Teste',
        categoria: {} as Categorias,
        precos: {} as Precos,
      };

      const result = await service.findProdutos(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(produtoRepository.findProdutos).toHaveBeenCalledWith(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar produto', () => {
    let mockUpdateProdutoDto: UpdateProdutoDto;

    beforeEach(() => {
      mockUpdateProdutoDto = {
        descricao: 'Produto teste',
        tipoItem: 1,
        unidade: 2,
        estoque: 0,
        estoqueMinimo: 0,
        estoqueMaximo: 0,
      };
    });

    it('deve retornar afetado > 0 se os dados do produto forem atualizados e retornar os novos dados', async () => {
      (produtoRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (produtoRepository.findOne as jest.Mock).mockResolvedValue('mockProduto');

      const result = await service.updateProduto(
        mockUpdateProdutoDto,
        'mockId',
      );

      expect(produtoRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateProdutoDto,
      );

      expect(result).toEqual('mockProduto');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (produtoRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateProduto(mockUpdateProdutoDto, 'mockId'),
      ).rejects.toThrow(Error);
    });
  });

  describe('Deletar produto', () => {
    it('deve retornar afetado > 0 se o produto for excluído', async () => {
      (produtoRepository.findOne as jest.Mock).mockResolvedValue('mockProduto');
      expect(produtoRepository.findOne).not.toHaveBeenCalled();

      (produtoRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteProduto('mockId');
      expect(produtoRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhum produto for excluído', async () => {
      (produtoRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteProduto('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
