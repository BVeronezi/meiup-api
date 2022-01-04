import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveProdutoVendaDto {
  @IsNotEmpty({
    message: 'Informe o id do produto que será removido',
  })
  @ApiProperty({
    description: 'Produto',
    type: Number,
  })
  produto: number;

  @IsNotEmpty({
    message: 'Informe o id do produto venda que será removido',
  })
  @ApiProperty({
    description: 'ID Produto venda',
    type: Number,
  })
  produtoVenda: number;
}
