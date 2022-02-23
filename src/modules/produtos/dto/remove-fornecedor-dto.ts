import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveProdutosFornecedorDto {
  @IsNotEmpty({
    message: 'Informe o id do produto fornecedor que será removido',
  })
  @ApiProperty({
    description: 'ID Produto fornecedor',
    type: Number,
  })
  produtoFornecedor: number;

  @IsNotEmpty({
    message: 'Informe qual fornecedor será removido do produto',
  })
  @ApiProperty({
    description: 'Produto',
    type: String,
  })
  produto: string;
}
