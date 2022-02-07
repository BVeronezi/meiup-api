import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { Empresa } from '../empresa/empresa.entity';
import { CreateCategoriaDto } from './dto/create-categoria-dto';
import { UpdateCategoriaDto } from './dto/update-categoria-dto';
import { Usuario } from '../usuario/usuario.entity';

describe('CategoriasController', () => {
  let categoriaController: CategoriasController;
  let categoriaService: CategoriasService;

  const mockUsuario = { id: '5', empresa: { id: '5' } } as Usuario;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        {
          provide: CategoriasService,
          useValue: createMock<CategoriasService>(),
        },
      ],
    }).compile();

    categoriaService = moduleRef.get<CategoriasService>(CategoriasService);
    categoriaController =
      moduleRef.get<CategoriasController>(CategoriasController);
  });

  it('Deve ser definido', async () => {
    expect(categoriaController).toBeDefined();
  });

  it('Deve buscar categoria por id', async () => {
    await categoriaController.findCategoriaById(1);

    expect(categoriaService.findCategoriaById).toBeCalled();
  });

  it('deve buscar categoria pelos filtros ou retorna todas caso não informe os filtros', async () => {
    const query = {
      nome: 'categoria',
    };

    await categoriaController.findCategorias(query, mockUsuario);

    expect(categoriaService.findCategorias).toBeCalled();
  });

  it('deve criar a categoria', async () => {
    const mockCategoria: CreateCategoriaDto = {
      nome: 'categoria',
      empresa: { id: '5' } as Empresa,
    };

    expect(
      await categoriaController.createCategoria(mockCategoria, mockUsuario),
    ).toMatchObject({
      categoria: {},
      message: 'Categoria cadastrada com sucesso',
    });
  });

  it('deve atualizar a categoria por id', async () => {
    const mockCategoria: UpdateCategoriaDto = {
      nome: 'categoria',
    };

    expect(
      await categoriaController.updateCategoria(
        mockCategoria,
        'mockIdCategoria',
      ),
    ).toMatchObject({
      categoria: {},
      message: 'Categoria atualizada com sucesso',
    });
  });

  it('deve remover o cliente por id', async () => {
    expect(await categoriaController.deleteCategoria('mockId')).toMatchObject({
      message: 'Categoria removida com sucesso',
    });
  });
});
