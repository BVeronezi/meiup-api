import { ApiProperty } from '@nestjs/swagger';
import { Vendas } from '../vendas.entity';

export class ReturnVendasDto {
  @ApiProperty()
  venda: Vendas;

  @ApiProperty()
  message: string;
}
