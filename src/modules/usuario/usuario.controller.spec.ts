import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Empresa } from '../empresa/empresa.entity';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { UsuariosController } from './usuario.controller';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

describe('UsuariosController', () => {
  let usuarioController: UsuariosController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuarioService,
          useValue: createMock<UsuarioService>(),
        },
      ],
    }).compile();

    usuarioService = moduleRef.get<UsuarioService>(UsuarioService);
    usuarioController = moduleRef.get<UsuariosController>(UsuariosController);
  });

  it('Deve ser definido', async () => {
    expect(usuarioController).toBeDefined();
  });

  it('Deve buscar usuário por id', async () => {
    await usuarioController.findUserById(1);

    expect(usuarioService.findUserById).toBeCalled();
  });

  it('deve buscar usuário pelos filtros ou retorna todos caso não informe os filtros', async () => {
    const query = {
      nome: 'teste',
      email: '',
      tipo: TipoUsuario.FUNCIONARIO,
    };

    const empresa = { id: '5' } as Empresa;

    await usuarioController.findUsers(query, empresa);

    expect(usuarioService.findUsers).toBeCalled();
  });

  it('deve criar o usuário', async () => {
    const mockUsuario: CreateUsuarioDto = {
      nome: 'Teste',
      email: 'teste@example.com',
      empresa: { id: '5' } as Empresa,
      tipo: TipoUsuario.MEI,
      senha: '123456',
    };

    expect(await usuarioController.createUser(mockUsuario)).toMatchObject({
      user: {},
      message: 'Usuário cadastrado com sucesso',
    });
  });

  it('deve atualizar o usuário por id', async () => {
    const mockUsuario: UpdateUsuarioDto = {
      nome: 'Teste',
      email: 'teste2@example.com',
    };

    const usuario = { id: '5', tipo: TipoUsuario.MEI } as Usuario;

    expect(await usuarioController.updateUser(mockUsuario, usuario, 'mockId'));
  });

  it('deve remover o usuário por id', async () => {
    expect(await usuarioController.deleteUser('mockId')).toMatchObject({
      message: 'Usuário removido com sucesso',
    });
  });
});
