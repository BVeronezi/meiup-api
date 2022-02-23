import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ProdutosFornecedoresController } from './produtos_fornecedores.controller';
import { ProdutosFornecedoresService } from './produtos_fornecedores.service';

describe('ProdutosFornecedoresController', () => {
  let produtoForneceodrController: ProdutosFornecedoresController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProdutosFornecedoresController],
      providers: [
        {
          provide: ProdutosFornecedoresService,
          useValue: createMock<ProdutosFornecedoresService>(),
        },
      ],
    }).compile();

    produtoForneceodrController = moduleRef.get<ProdutosFornecedoresController>(
      ProdutosFornecedoresController,
    );
  });

  it('Deve ser definido', async () => {
    expect(produtoForneceodrController).toBeDefined();
  });
});
