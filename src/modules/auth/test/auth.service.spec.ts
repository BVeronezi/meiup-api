import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Empresa } from '../../empresa/empresa.entity';
import { TipoUsuario } from '../../usuario/enum/user-roles.enum';
import { Usuario } from '../../usuario/usuario.entity';
import { EmpresaService } from '../../empresa/empresa.service';
import { UsuarioService } from '../../usuario/usuario.service';
import { AuthService } from '../auth.service';
import { CreateUsuarioDto } from 'src/modules/usuario/dto/create-usuario.dto';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsuarioService: Partial<UsuarioService>;

  beforeEach(async () => {
    const fakeEmpresaService: Partial<EmpresaService> = {
      createCompany: () =>
        Promise.resolve({ id: '5', razaoSocial: 'Teste' } as Empresa),
    };

    fakeUsuarioService = {
      //findByEmail: () => Promise.resolve({ id: '1' } as Usuario),
      findUserByGoogleId: () =>
        Promise.resolve({
          id: '123',
          email: 'test@gmail.com',
          nome: 'Teste',
          tipo: TipoUsuario.FUNCIONARIO,
        } as Usuario),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: EmpresaService,
          useValue: fakeEmpresaService,
        },
        {
          provide: UsuarioService,
          useValue: fakeUsuarioService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve cadastrar um novo usuário', async () => {
    const params: CreateUsuarioDto = {
      nome: 'Teste',
      email: 'test@example.com',
      senha: '123456',
      tipo: TipoUsuario.FUNCIONARIO,
      empresa: { id: '5' } as Empresa,
    };

    const user = await service.cadastra(params);

    expect(user.senha).not.toEqual('asdfd');
    const { salt } = user;
    expect(salt).toBeDefined();
  });
});
