import { ApiProperty } from '@nestjs/swagger';
import { Agenda } from '../agenda.entity';

export class ReturnAgendaDto {
  @ApiProperty()
  agenda: Agenda;

  @ApiProperty()
  message: string;
}
