import { ApiProperty } from '@nestjs/swagger';
import { Promocoes } from '../promocoes.entity';

export class ReturnPromocaoDto {
  @ApiProperty()
  promocao: Promocoes;

  @ApiProperty()
  message: string;
}
