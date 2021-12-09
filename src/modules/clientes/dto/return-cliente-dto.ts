import { ApiProperty } from '@nestjs/swagger';
import { Clientes } from '../clientes.entity';

export class ReturnClienteDto {
  @ApiProperty()
  cliente: Clientes;

  @ApiProperty()
  message: string;
}
