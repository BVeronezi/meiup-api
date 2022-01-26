import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Fornecedores } from '../../fornecedores/fornecedores.entity';

export class FornecedorProdutoDto {
  @IsNotEmpty({
    message: 'Informe os fornecedores',
  })
  @ApiProperty({
    type: [Number],
  })
  fornecedores: Fornecedores[];
}
