import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PrecosController } from './precos.controller';
import { PrecosService } from './precos.service';

describe('PrecosController', () => {
  let precosController: PrecosController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PrecosController],
      providers: [
        {
          provide: PrecosService,
          useValue: createMock<PrecosService>(),
        },
      ],
    }).compile();

    precosController = moduleRef.get<PrecosController>(PrecosController);
  });

  it('Deve ser definido', async () => {
    expect(precosController).toBeDefined();
  });
});
