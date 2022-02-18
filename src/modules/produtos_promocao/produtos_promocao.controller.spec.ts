import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ProdutosPromocaoController } from './produtos_promocao.controller';
import { ProdutosPromocaoService } from './produtos_promocao.service';
describe('ProdutosPromocaoController', () => {
  let produtoPromocaoController: ProdutosPromocaoController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProdutosPromocaoController],
      providers: [
        {
          provide: ProdutosPromocaoService,
          useValue: createMock<ProdutosPromocaoService>(),
        },
      ],
    }).compile();

    produtoPromocaoController = moduleRef.get<ProdutosPromocaoController>(
      ProdutosPromocaoController,
    );
  });

  it('Deve ser definido', async () => {
    expect(produtoPromocaoController).toBeDefined();
  });
});
