import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { EnderecoController } from './endereco.controller';
import { EnderecoService } from './endereco.service';

describe('EnderecoController', () => {
  let enderecoController: EnderecoController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EnderecoController],
      providers: [
        {
          provide: EnderecoService,
          useValue: createMock<EnderecoService>(),
        },
      ],
    }).compile();

    enderecoController = moduleRef.get<EnderecoController>(EnderecoController);
  });

  it('Deve ser definido', async () => {
    expect(enderecoController).toBeDefined();
  });
});
