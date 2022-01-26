import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    app.init();
  });

  it('deve ser definido', async () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o serviço de login', async () => {
    await controller.signIn({
      email: 'teste@gmail.com',
      senha: '123456',
    });

    expect(service.signIn).toBeCalled();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });
});
