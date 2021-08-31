import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../usuario.entity';

export class ReturnUsuarioDto {
  @ApiProperty()
  user: Usuario;

  @ApiProperty()
  message: string;
}
