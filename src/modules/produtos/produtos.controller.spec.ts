import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { Precos } from '../precos/precos.entity';
import { Categorias } from '../categorias/categorias.entity';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { UpdateProdutoDto } from './dto/update-produto-dto';
import { PrecosService } from '../precos/precos.service';
import { CategoriasService } from '../categorias/categorias.service';
import { Usuario } from '../usuario/usuario.entity';
import { ProdutosFornecedoresService } from '../produtos_fornecedores/produtos_fornecedores.service';

describe('ProdutosController', () => {
  let produtoController: ProdutosController;
  let produtoService: ProdutosService;

  const mockUsuario = { id: '5', empresa: { id: '5' } } as Usuario;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: createMock<ProdutosService>(),
        },
        {
          provide: PrecosService,
          useValue: createMock<PrecosService>(),
        },
        {
          provide: CategoriasService,
          useValue: createMock<CategoriasService>(),
        },
        {
          provide: ProdutosFornecedoresService,
          useValue: createMock<ProdutosFornecedoresService>(),
        },
      ],
    }).compile();

    produtoService = moduleRef.get<ProdutosService>(ProdutosService);
    produtoController = moduleRef.get<ProdutosController>(ProdutosController);
  });

  it('Deve ser definido', async () => {
    expect(produtoController).toBeDefined();
  });

  it('Deve buscar produto por id', async () => {
    await produtoController.findProdutoById(1);

    expect(produtoService.findProdutoById).toBeCalled();
  });

  it('deve buscar produto pelos filtros ou retorna todos caso não informe os filtros', async () => {
    const query: FindProdutosQueryDto = {
      descricao: 'Produto Teste',
      categoria: {} as Categorias,
      precos: {} as Precos,
    };

    await produtoController.findProdutos(query, mockUsuario);

    expect(produtoService.findProdutos).toBeCalled();
  });

  it('deve criar o produto', async () => {
    const mockProduto: CreateProdutoDto = {
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

    expect(
      await produtoController.createProduto(mockProduto, mockUsuario),
    ).toMatchObject({
      produto: {},
      message: 'Produto cadastrado com sucesso',
    });
  });

  it('deve atualizar o produto por id', async () => {
    const mockProduto: UpdateProdutoDto = {
      descricao: 'Produto teste 2',
      tipoItem: 1,
      unidade: 2,
    };

    expect(
      await produtoController.updateProduto(mockProduto, 'mockIdProduto'),
    ).toMatchObject({ produto: {}, message: 'Produto atualizado com sucesso' });
  });

  it('deve remover o produto por id', async () => {
    expect(
      await produtoController.deleteProduto('mockId', mockUsuario),
    ).toMatchObject({
      message: 'Produto removido com sucesso',
    });
  });
});
