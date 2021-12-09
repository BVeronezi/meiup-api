import { ApiProperty } from '@nestjs/swagger';
import { Produtos } from '../produtos.entity';

export class ReturnProdutoDto {
  @ApiProperty()
  produto: Produtos;

  @ApiProperty()
  message: string;
}
