import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ProdutosServicoController } from './produtos_servico.controller';
import { ProdutosServicoService } from './produtos_servico.service';

describe('ProdutosServicoController', () => {
  let produtoServicoController: ProdutosServicoController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProdutosServicoController],
      providers: [
        {
          provide: ProdutosServicoService,
          useValue: createMock<ProdutosServicoService>(),
        },
      ],
    }).compile();

    produtoServicoController = moduleRef.get<ProdutosServicoController>(
      ProdutosServicoController,
    );
  });

  it('Deve ser definido', async () => {
    expect(produtoServicoController).toBeDefined();
  });
});
