import { ApiProperty } from '@nestjs/swagger';
import { ProdutosVenda } from '../produtos_venda.entity';

export class ReturnProdutosVendaDto {
  @ApiProperty()
  produtosVenda: ProdutosVenda;

  @ApiProperty()
  message: string;
}
