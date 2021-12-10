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
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { titulo, descricao } = queryDto;
    const query = this.createQueryBuilder('agenda');

    query.andWhere('agenda.usuarioId = :usuarioId', {
      usuarioId: Number(usuarioId),
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

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['agenda.id', 'agenda.titulo', 'agenda.descricao']);

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
