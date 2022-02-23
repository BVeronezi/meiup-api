import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Fornecedores } from 'src/modules/fornecedores/fornecedores.entity';
import { Empresa } from '../../empresa/empresa.entity';
import { Produtos } from '../../produtos/produtos.entity';

export class ProdutoFornecedorDto {
  @IsOptional()
  @ApiProperty({
    description: 'Id produto fornecedor',
    type: 'string',
  })
  id?: string;

  @IsNotEmpty({
    message: 'Informe o produto',
  })
  @ApiProperty({
    description: 'Produto',
    type: 'number',
  })
  produto: Produtos;

  @IsNotEmpty({
    message: 'Informe o fornecedor',
  })
  @ApiProperty({
    description: 'Fornecedor',
    type: 'number',
  })
  fornecedor: Fornecedores;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
