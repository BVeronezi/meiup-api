import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ServicosPromocaoController } from './servicos_promocao.controller';
import { ServicosPromocaoService } from './servicos_promocao.service';

describe('ServicosPromocaoController', () => {
  let servicoPromocaoController: ServicosPromocaoController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ServicosPromocaoController],
      providers: [
        {
          provide: ServicosPromocaoService,
          useValue: createMock<ServicosPromocaoService>(),
        },
      ],
    }).compile();

    servicoPromocaoController = moduleRef.get<ServicosPromocaoController>(
      ServicosPromocaoController,
    );
  });

  it('Deve ser definido', async () => {
    expect(servicoPromocaoController).toBeDefined();
  });
});
