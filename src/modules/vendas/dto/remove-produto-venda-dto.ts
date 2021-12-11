import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveProdutoVendaDto {
  @IsNotEmpty({
    message: 'Informe quais produtos serão removidos da venda',
  })
  @ApiProperty({
    description: 'Produtos',
    type: [Number],
  })
  produtos: [number];
}
