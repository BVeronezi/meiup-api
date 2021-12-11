import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveProdutosServicoDto {
  @IsNotEmpty({
    message: 'Informe quais produtos serão removidos do servico',
  })
  @ApiProperty({
    description: 'Produtos',
    type: [Number],
  })
  produtos: [number];
}
