import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Usuario } from 'src/modules/usuario/usuario.entity';

export class CreateAgendaDto {
  @IsNotEmpty({
    message: 'Informe um titulo',
  })
  @ApiProperty({
    description: 'Titulo',
    type: 'string',
  })
  titulo: string;

  @IsNotEmpty({
    message: 'Informe uma descrição',
  })
  @ApiProperty({
    description: 'Descrição',
    type: 'string',
  })
  descricao: string;

  @IsNotEmpty({
    message: 'Informe uma data',
  })
  @ApiProperty({
    description: 'Data',
    type: 'date',
  })
  data: Date;

  @ApiPropertyOptional({
    description: 'Participantes',
    type: 'string',
  })
  participantes: string;

  @ApiProperty({
    description: 'Notificar usuário',
    type: 'boolean',
    default: false,
  })
  notificar: boolean;

  @ApiProperty({
    description: 'Notificar participantes',
    type: 'boolean',
    default: false,
  })
  notificarParticipantes: boolean;

  @ApiProperty({
    description: 'Usuario vinculado a agenda',
  })
  usuario: Usuario;
}
