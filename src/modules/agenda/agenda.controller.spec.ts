import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { Usuario } from '../usuario/usuario.entity';
import { CreateAgendaDto } from './dto/create-agenda-dto';
import { UpdateAgendaDto } from './dto/update-agenda-dto';

describe('AgendaController', () => {
  let agendaController: AgendaController;
  let agendaService: AgendaService;

  const mockUsuario = { id: '5' } as Usuario;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AgendaController],
      providers: [
        {
          provide: AgendaService,
          useValue: createMock<AgendaService>(),
        },
      ],
    }).compile();

    agendaService = moduleRef.get<AgendaService>(AgendaService);
    agendaController = moduleRef.get<AgendaController>(AgendaController);
  });

  it('Deve ser definido', async () => {
    expect(agendaController).toBeDefined();
  });

  it('Deve buscar agenda por id', async () => {
    await agendaController.findAgendaById(1);

    expect(agendaService.findAgendaById).toBeCalled();
  });

  it('deve buscar agenda pelos filtros ou retorna todas caso não informe os filtros', async () => {
    const query = {
      titulo: 'teste',
    };

    await agendaController.findAgenda(query, mockUsuario);

    expect(agendaService.findAgenda).toBeCalled();
  });

  it('deve criar agenda', async () => {
    const mockAgenda: CreateAgendaDto = {
      titulo: 'Teste',
      descricao: 'descricao',
      data: new Date(),
      usuario: mockUsuario,
    };

    expect(
      await agendaController.createAgenda(mockAgenda, mockUsuario),
    ).toMatchObject({
      agenda: {},
      message: 'Agenda cadastrada com sucesso',
    });
  });

  it('deve atualizar a agenda por id', async () => {
    const mockAgenda: UpdateAgendaDto = {
      titulo: 'Teste 2',
    };

    expect(
      await agendaController.updateAgenda(mockAgenda, 'mockId'),
    ).toMatchObject({
      agenda: {},
      message: 'Agenda atualizado com sucesso',
    });
  });

  it('deve remover agenda por id', async () => {
    expect(await agendaController.deleteAgenda('mockId')).toMatchObject({
      message: 'Agenda removida com sucesso',
    });
  });
});
