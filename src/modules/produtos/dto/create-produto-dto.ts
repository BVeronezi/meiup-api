import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Categorias } from '../../categorias/categorias.entity';
import { Empresa } from '../../empresa/empresa.entity';
import { Precos } from '../../precos/precos.entity';
export class CreateProdutoDto {
  @IsNotEmpty({
    message: 'Informe uma descrição para o produto',
  })
  @ApiProperty({
    description: 'Descrição do produto para cadastro no sistema',
    type: 'string',
  })
  descricao: string;

  @IsNotEmpty({
    message: 'Informe qual o tipo do item',
  })
  @ApiProperty({
    description:
      'Tipo de item para cadastro no sistema: 1 - Produto; 2 - Insumo; 3 - Kit; 4 - Brinde',
    type: 'number',
  })
  tipoItem: number;

  @IsNotEmpty({
    message: 'Informe a unidade do item',
  })
  @ApiProperty({
    description:
      'Unidade para cadastro no sistema: 1 - Quilograma; 2 - Caixa; 3 - Fardo',
    type: 'number',
  })
  unidade: number;

  @IsNotEmpty({
    message: 'Informe a categoria',
  })
  @ApiProperty({
    description: 'Categoria do item',
    type: 'number',
  })
  categoria: Categorias;

  @ApiPropertyOptional({
    description: 'Estoque do item',
    type: 'number',
  })
  estoque?: number;

  @ApiPropertyOptional({
    description: 'Estoque mínimo do item',
    type: 'number',
  })
  estoqueMinimo?: number;

  @ApiPropertyOptional({
    description: 'Estoque máximo do item',
    type: 'number',
  })
  estoqueMaximo?: number;

  @IsNotEmpty({
    message: 'Informe o preço do item',
  })
  @ApiProperty({
    description: 'Precos do item',
  })
  precos: Precos;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
