import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ProdutosVendaController } from './produtos_venda.controller';
import { ProdutosVendaService } from './produtos_venda.service';

describe('ProdutosVendaController', () => {
  let produtoVendaController: ProdutosVendaController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProdutosVendaController],
      providers: [
        {
          provide: ProdutosVendaService,
          useValue: createMock<ProdutosVendaService>(),
        },
      ],
    }).compile();

    produtoVendaController = moduleRef.get<ProdutosVendaController>(
      ProdutosVendaController,
    );
  });

  it('Deve ser definido', async () => {
    expect(produtoVendaController).toBeDefined();
  });
});
