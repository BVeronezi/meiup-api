import { ApiProperty } from '@nestjs/swagger';
import { Categorias } from '../categorias.entity';

export class ReturnCategoriaDto {
  @ApiProperty()
  categoria: Categorias;

  @ApiProperty()
  message: string;
}
