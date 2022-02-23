import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Fornecedores } from '../../fornecedores/fornecedores.entity';
import { Categorias } from '../../categorias/categorias.entity';
import { Precos } from '../../precos/precos.entity';

export class UpdateProdutoDto {
  @IsOptional()
  @ApiProperty({
    description: 'Descrição do produto para cadastro no sistema',
    type: 'string',
  })
  descricao?: string;

  @IsOptional()
  @ApiProperty({
    description:
      'Tipo de item para cadastro no sistema: 1 - Produto; 2 - Insumo; 3 - Kit; 4 - Brinde',
    type: 'number',
  })
  tipoItem?: number;

  @IsOptional()
  @ApiProperty({
    description:
      'Unidade para cadastro no sistema: 1 - Quilograma ;2 - Caixa; 3 - Fardo',
    type: 'number',
  })
  unidade?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Categoria do item',
    type: 'number',
  })
  categoria?: Categorias;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Estoque do item',
    type: 'number',
  })
  estoque?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Estoque mínimo do item',
    type: 'number',
  })
  estoqueMinimo?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Estoque máximo do item',
    type: 'number',
  })
  estoqueMaximo?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Precos do item',
    type: {},
  })
  precos?: Precos;

  @IsOptional()
  @ApiProperty({
    description: 'Fornecedor do item',
    type: 'number',
  })
  fornecedor?: Fornecedores;
}
