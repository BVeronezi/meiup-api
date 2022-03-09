import { EntityRepository, Repository } from 'typeorm';
import { Agenda } from './agenda.entity';
import { CreateAgendaDto } from './dto/create-agenda-dto';
import { FindAgendaQueryDto } from './dto/find-agenda-query-dto';

@EntityRepository(Agenda)
export class AgendaRepository extends Repository<Agenda> {
  async findAgenda(
    queryDto: FindAgendaQueryDto,
    usuarioId: string,
  ): Promise<{ agenda: Agenda[]; total: number }> {
    const { titulo, descricao } = queryDto;
    const query = this.createQueryBuilder('agenda');

    query.andWhere('agenda.usuarioId = :usuarioId', {
      usuarioId: String(usuarioId),
    });

    if (titulo) {
      query.andWhere('agenda.titulo ILIKE :titulo', {
        titulo: `%${titulo}%`,
      });
    }

    if (descricao) {
      query.andWhere('agenda.descricao ILIKE :descricao', {
        descricao: `%${descricao}%`,
      });
    }
    query.select([
      'agenda.id',
      'agenda.titulo',
      'agenda.data',
      'agenda.descricao',
    ]);

    const [agenda, total] = await query.getManyAndCount();

    return { agenda, total };
  }

  async createAgenda(createAgendaDto: CreateAgendaDto): Promise<Agenda> {
    const {
      titulo,
      descricao,
      data,
      participantes,
      notificar,
      notificarParticipantes,
      usuario,
    } = createAgendaDto;

    const agenda = this.create();
    agenda.titulo = titulo;
    agenda.descricao = descricao;
    agenda.data = data;
    agenda.participantes = participantes;
    agenda.notificar = notificar;
    agenda.notificarParticipantes = notificarParticipantes;
    agenda.usuario = usuario;

    try {
      return await agenda.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
