import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveProdutosPromocaoDto {
  @IsNotEmpty({
    message: 'Informe o id do produto promoção que será removido',
  })
  @ApiProperty({
    description: 'ID Produto promoção',
    type: Number,
  })
  produtoPromocao: number;

  @IsNotEmpty({
    message: 'Informe qual produto será removido da promoção',
  })
  @ApiProperty({
    description: 'Produto',
    type: String,
  })
  produto: string;
}
