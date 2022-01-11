import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveProdutosServicoDto {
  @IsNotEmpty({
    message: 'Informe o id do produto serviço que será removido',
  })
  @ApiProperty({
    description: 'ID Produto serviço',
    type: Number,
  })
  produtoServico: number;

  @IsNotEmpty({
    message: 'Informe qual produto será removido do servico',
  })
  @ApiProperty({
    description: 'Produto',
    type: String,
  })
  produto: string;
}
