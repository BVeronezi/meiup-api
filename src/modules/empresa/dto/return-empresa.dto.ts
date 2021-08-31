import { ApiProperty } from '@nestjs/swagger';
import { Empresa } from '../empresa.entity';

export class ReturnEmpresaDto {
  @ApiProperty()
  empresa: Empresa;

  @ApiProperty()
  message: string;
}
