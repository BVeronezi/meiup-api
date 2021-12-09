import { ApiPropertyOptional } from '@nestjs/swagger';
import { Categorias } from 'src/modules/categorias/categorias.entity';
import { Precos } from 'src/modules/precos/precos.entity';

export class UpdateProdutoDto {
  @ApiPropertyOptional({
    description: 'Descrição do produto para cadastro no sistema',
    type: 'string',
  })
  descricao: string;

  @ApiPropertyOptional({
    description:
      'Tipo de item para cadastro no sistema: 1 - Produto; 2 - Insumo; 3 - Kit; 4 - Brinde',
    type: 'number',
  })
  tipoItem: number;

  @ApiPropertyOptional({
    description: 'Unidade para cadastro no sistema: Quilograma;Caixa;Fardo',
    type: 'string',
  })
  unidade: string;

  @ApiPropertyOptional({
    description: 'Categoria do item',
    type: 'number',
  })
  categoria: Categorias;

  @ApiPropertyOptional({
    description: 'Estoque do item',
    type: 'number',
  })
  estoque: number;

  @ApiPropertyOptional({
    description: 'Estoque mínimo do item',
    type: 'number',
  })
  estoqueMinimo: number;

  @ApiPropertyOptional({
    description: 'Estoque máximo do item',
    type: 'number',
  })
  estoqueMaximo: number;

  @ApiPropertyOptional({
    description: 'Precos do item',
  })
  precos: Precos;
}
