import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { UserRole } from '../../usuario/enum/user-roles.enum';
import { Empresa } from 'src/modules/empresa/empresa.entity';

describe('AuthController', () => {
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
  });

  it('deve ser definido', async () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o serviço de cadastro', async () => {
    const params = {
      nome: 'Teste',
      email: 'teste@gmail.com',
      senha: '123456',
      role: UserRole.MEI,
      empresa: { id: '5' } as Empresa,
    };

    await controller.cadastra(params);

    expect(service.cadastra).toBeCalled();
  });

  it('deve chamar o serviço de login', async () => {
    await controller.login({
      email: 'teste@gmail.com',
      senha: '123456',
    });

    expect(service.login).toBeCalled();
  });
});
