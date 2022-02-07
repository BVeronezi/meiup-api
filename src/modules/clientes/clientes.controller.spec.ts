import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Empresa } from '../empresa/empresa.entity';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Usuario } from '../usuario/usuario.entity';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { UpdateClienteDto } from './dto/update-cliente-dto';

describe('ClientesController', () => {
  let clienteController: ClientesController;
  let clienteService: ClientesService;

  const mockUsuario = { id: '5', empresa: { id: '5' } } as Usuario;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: createMock<ClientesService>(),
        },
      ],
    }).compile();

    clienteService = moduleRef.get<ClientesService>(ClientesService);
    clienteController = moduleRef.get<ClientesController>(ClientesController);
  });

  it('Deve ser definido', async () => {
    expect(clienteController).toBeDefined();
  });

  it('Deve buscar cliente por id', async () => {
    await clienteController.findClienteById(1);

    expect(clienteService.findClienteById).toBeCalled();
  });

  it('deve buscar cliente pelos filtros ou retorna todos caso não informe os filtros', async () => {
    const query = {
      nome: 'teste',
      email: '',
      tipo: TipoUsuario.FUNCIONARIO,
    };

    await clienteController.findClientes(query, mockUsuario);

    expect(clienteService.findClientes).toBeCalled();
  });

  it('deve criar o cliente', async () => {
    const mockCliente: CreateClienteDto = {
      nome: 'Teste',
      email: 'teste@example.com',
      empresa: { id: '5' } as Empresa,
    };

    expect(
      await clienteController.createCliente(mockCliente, mockUsuario),
    ).toMatchObject({
      cliente: {},
      message: 'Cliente cadastrado com sucesso',
    });
  });

  it('deve atualizar o cliente por id', async () => {
    const mockCliente: UpdateClienteDto = {
      nome: 'Teste',
      email: 'teste2@example.com',
    };

    expect(
      await clienteController.updateCliente(
        mockCliente,
        'mockIdCliente',
        mockUsuario,
      ),
    ).toMatchObject({ cliente: {}, message: 'Cliente atualizado com sucesso' });
  });

  it('deve remover o cliente por id', async () => {
    expect(await clienteController.deleteCliente('mockId')).toMatchObject({
      message: 'Cliente removido com sucesso',
    });
  });
});
