import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAgendaDto {
  @IsOptional()
  @ApiProperty({
    description: 'Titulo',
    type: 'string',
  })
  titulo: string;

  @IsOptional()
  @ApiProperty({
    description: 'Descrição',
    type: 'string',
  })
  descricao: string;

  @IsOptional()
  @ApiProperty({
    description: 'Data',
    type: 'date',
  })
  data: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Participantes',
    type: 'string',
  })
  participantes: string;

  @IsOptional()
  @ApiProperty({
    description: 'Notificar usuário',
    type: 'boolean',
    default: false,
  })
  notificar: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'Notificar participantes',
    type: 'boolean',
    default: false,
  })
  notificarParticipantes: boolean;
}
