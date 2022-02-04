import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Empresa } from '../empresa/empresa.entity';
import { PromocoesController } from './promocoes.controller';
import { PromocoesService } from './promocoes.service';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { UpdatePromocaoDto } from './dto/update-promocao-dto';

describe('PromocoesController', () => {
  let promocaoController: PromocoesController;
  let promocaoService: PromocoesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PromocoesController],
      providers: [
        {
          provide: PromocoesService,
          useValue: createMock<PromocoesService>(),
        },
      ],
    }).compile();

    promocaoService = moduleRef.get<PromocoesService>(PromocoesService);
    promocaoController =
      moduleRef.get<PromocoesController>(PromocoesController);
  });

  it('Deve ser definido', async () => {
    expect(promocaoController).toBeDefined();
  });

  it('Deve buscar promoção por id', async () => {
    await promocaoController.findPromocaoById(1);

    expect(promocaoService.findPromocaoById).toBeCalled();
  });

  it('deve buscar promoção pelos filtros ou retorna todos caso não informe os filtros', async () => {
    const query = {
      descricao: 'Promoção teste',
    };

    const empresa = { id: '5' } as Empresa;

    await promocaoController.findPromocoes(query, empresa);

    expect(promocaoService.findPromocoes).toBeCalled();
  });

  it('deve criar o promoção', async () => {
    const mockPromocao: CreatePromocaoDto = {
      descricao: 'Promoção teste',
      produtos: [{ id: 1, descricao: 'Produto Teste' }],
      valorPromocional: 10.0,
      dataInicio: new Date(),
      dataFim: new Date(),
      empresa: { id: '5' } as Empresa,
    };

    expect(
      await promocaoController.createPromocao(
        mockPromocao,
        mockPromocao.empresa,
      ),
    ).toMatchObject({
      promocao: {},
      message: 'Promoção cadastrada com sucesso',
    });
  });

  it('deve atualizar o promoção por id', async () => {
    const mockPromocao: UpdatePromocaoDto = {
      valorPromocional: 12.0,
    };

    expect(
      await promocaoController.updatePromocao(mockPromocao, 'mockIdPromocao'),
    ).toMatchObject({
      promocao: {},
      message: 'Promoção atualizada com sucesso',
    });
  });

  it('deve remover o promoção por id', async () => {
    expect(await promocaoController.deletePromocao('mockId')).toMatchObject({
      message: 'Promoção removida com sucesso',
    });
  });
});
