import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agenda } from './agenda.entity';
import { AgendaRepository } from './agenda.repository';
import { CreateAgendaDto } from './dto/create-agenda-dto';
import { FindAgendaQueryDto } from './dto/find-agenda-query-dto';
import { UpdateAgendaDto } from './dto/update-agenda-dto';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(AgendaRepository)
    private agendaRepository: AgendaRepository,
  ) {}

  async createAgenda(createAgendaDto: CreateAgendaDto): Promise<Agenda> {
    return await this.agendaRepository.createAgenda(createAgendaDto);
  }

  async findAgendaById(agendaId: number): Promise<Agenda> {
    const agenda = await this.agendaRepository.findOne(agendaId);

    if (!agenda) throw new NotFoundException('Agenda não encontrada');

    return agenda;
  }

  async findAgenda(
    queryDto: FindAgendaQueryDto,
    usuarioId: string,
  ): Promise<{ agenda: Agenda[]; total: number }> {
    const agenda = await this.agendaRepository.findAgenda(queryDto, usuarioId);
    return agenda;
  }

  async updateAgenda(updateAgendaDto: UpdateAgendaDto, id: string) {
    const result = await this.agendaRepository.update(
      { id },
      {
        titulo: updateAgendaDto.titulo,
        descricao: updateAgendaDto.descricao,
        data: updateAgendaDto.data,
        participantes: updateAgendaDto.participantes,
        notificar: updateAgendaDto.notificar,
        notificarParticipantes: updateAgendaDto.notificarParticipantes,
      },
    );

    if (result.affected > 0) {
      const agenda = await this.findAgendaById(Number(id));
      return {
        agenda,
        message: 'Agenda atualizado com sucesso',
      };
    } else {
      throw new NotFoundException('Agenda não encontrada');
    }
  }

  async deleteAgenda(agendaId: number) {
    const result = await this.agendaRepository.delete({
      id: String(agendaId),
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado agenda com o ID informado',
      );
    }
  }
}
