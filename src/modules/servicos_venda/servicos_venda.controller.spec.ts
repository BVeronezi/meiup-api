import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ServicosVendaController } from './servicos_venda.controller';
import { ServicosVendaService } from './servicos_venda.service';

describe('ServicosVendaController', () => {
  let servicoVendaController: ServicosVendaController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ServicosVendaController],
      providers: [
        {
          provide: ServicosVendaService,
          useValue: createMock<ServicosVendaService>(),
        },
      ],
    }).compile();

    servicoVendaController = moduleRef.get<ServicosVendaController>(
      ServicosVendaController,
    );
  });

  it('Deve ser definido', async () => {
    expect(servicoVendaController).toBeDefined();
  });
});
