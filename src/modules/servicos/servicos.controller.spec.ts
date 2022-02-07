import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Empresa } from '../empresa/empresa.entity';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';
import { ProdutosService } from '../produtos/produtos.service';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { FindServicosQueryDto } from './dto/find-servicos-query-dto';
import { CreateServicosDto } from './dto/create-servicos-dto';
import { UpdateServicosDto } from './dto/update-servicos-dto';
import { Usuario } from '../usuario/usuario.entity';

describe('ServicosController', () => {
  let servicoController: ServicosController;
  let servicoService: ServicosService;

  const mockUsuario = { id: '5', empresa: { id: '5' } } as Usuario;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [
        {
          provide: ServicosService,
          useValue: createMock<ProdutosService>(),
        },
        {
          provide: ProdutosService,
          useValue: createMock<ProdutosService>(),
        },
        {
          provide: ProdutosServicoService,
          useValue: createMock<ProdutosServicoService>(),
        },
      ],
    }).compile();

    servicoService = moduleRef.get<ServicosService>(ServicosService);
    servicoController = moduleRef.get<ServicosController>(ServicosController);
  });

  it('Deve ser definido', async () => {
    expect(servicoController).toBeDefined();
  });

  it('Deve buscar serviço por id', async () => {
    await servicoController.findServicoById(1);

    expect(servicoService.findServicoById).toBeCalled();
  });

  it('deve buscar serviço pelos filtros ou retorna todos caso não informe os filtros', async () => {
    const query: FindServicosQueryDto = {
      nome: 'Serviço Teste',
    };

    await servicoController.findServicos(query, mockUsuario);

    expect(servicoService.findServicos).toBeCalled();
  });

  it('deve criar o serviço', async () => {
    const mockServico: CreateServicosDto = {
      nome: 'Serviço teste',
      empresa: { id: '5' } as Empresa,
    };

    expect(
      await servicoController.createServico(mockServico, mockUsuario),
    ).toMatchObject({
      servico: {},
      message: 'Serviço cadastrado com sucesso',
    });
  });

  it('deve atualizar o serviço por id', async () => {
    const mockUpdateServico: UpdateServicosDto = {
      nome: 'Serviço teste 2',
      custo: 10,
      valor: 20,
      margemLucro: 10,
    };

    expect(
      await servicoController.updateServico(mockUpdateServico, 'mockIdServico'),
    ).toMatchObject({ servico: {}, message: 'Serviço atualizado com sucesso' });
  });

  it('deve remover o serviço por id', async () => {
    expect(
      await servicoController.deleteServico('mockId', mockUsuario),
    ).toMatchObject({
      message: 'Serviço removido com sucesso',
    });
  });
});
