import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';

describe('EmpresaController', () => {
  let empresaController: EmpresaController;
  let empresaService: EmpresaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [
        {
          provide: EmpresaService,
          useValue: createMock<EmpresaService>(),
        },
      ],
    }).compile();

    empresaService = moduleRef.get<EmpresaService>(EmpresaService);
    empresaController = moduleRef.get<EmpresaController>(EmpresaController);
  });

  it('Deve ser definido', async () => {
    expect(empresaController).toBeDefined();
  });

  it('Deve buscar empresa por id', async () => {
    await empresaController.findCompanyById(1);

    expect(empresaService.findEmpresaById).toBeCalled();
  });
});
