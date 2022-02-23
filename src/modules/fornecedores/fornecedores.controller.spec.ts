import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Empresa } from '../empresa/empresa.entity';
import { Usuario } from '../usuario/usuario.entity';
import { FornecedoresService } from './fornecedores.service';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor-dto';
import { FornecedoresController } from './fornecedores.controller';

describe('FornecedoresController', () => {
  let fornecedorController: FornecedoresController;
  let fornecedorService: FornecedoresService;

  const mockUsuario = { id: '5', empresa: { id: '5' } } as Usuario;
  const mockEmpresa = { id: '1' } as Empresa;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FornecedoresController],
      providers: [
        {
          provide: FornecedoresService,
          useValue: createMock<FornecedoresService>(),
        },
      ],
    }).compile();

    fornecedorService = moduleRef.get<FornecedoresService>(FornecedoresService);
    fornecedorController = moduleRef.get<FornecedoresController>(
      FornecedoresController,
    );
  });

  it('Deve ser definido', async () => {
    expect(fornecedorController).toBeDefined();
  });

  it('Deve buscar fornecedor por id', async () => {
    await fornecedorController.findFornecedorById(1);

    expect(fornecedorService.findFornecedorById).toBeCalled();
  });

  it('deve buscar fornecedor pelos filtros ou retorna todos caso não informe os filtros', async () => {
    const query = {
      nome: 'teste',
      email: '',
    };

    await fornecedorController.findFornecedores(query, mockUsuario);

    expect(fornecedorService.findFornecedores).toBeCalled();
  });

  it('deve criar o fornecedor', async () => {
    const mockFornecedor: CreateFornecedorDto = {
      nome: 'Teste',
      cpfCnpj: '1231321123',
      situacaoCadastral: 'regular',
      email: 'teste@example.com',
      empresa: mockEmpresa,
    };

    expect(
      await fornecedorController.createFornecedor(mockFornecedor, mockUsuario),
    ).toMatchObject({
      fornecedor: {},
      message: 'Fornecedor cadastrado com sucesso',
    });
  });

  it('deve atualizar o fornecedor por id', async () => {
    const mockFornecedor: UpdateFornecedorDto = {
      nome: 'Teste',
      email: 'teste2@example.com',
    };

    expect(
      await fornecedorController.updateFornecedor(
        mockFornecedor,
        'mockIdFornecedor',
        mockUsuario,
      ),
    ).toMatchObject({
      fornecedor: {},
      message: 'Fornecedor atualizado com sucesso',
    });
  });

  it('deve remover o fornecedor por id', async () => {
    expect(
      await fornecedorController.deleteFornecedor('mockId', mockUsuario),
    ).toMatchObject({
      message: 'Fornecedor removido com sucesso',
    });
  });
});
