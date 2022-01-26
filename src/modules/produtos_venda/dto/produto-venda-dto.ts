import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
import { Produtos } from '../../produtos/produtos.entity';
import { Vendas } from '../../vendas/vendas.entity';

export class ProdutoVendaDto {
  @IsOptional()
  @ApiProperty({
    description: 'Id produto venda',
    type: 'string',
  })
  id: string;

  @IsNotEmpty({
    message: 'Informe o produto',
  })
  @ApiProperty({
    description: 'Produto',
    type: 'number',
  })
  produto: Produtos;

  @IsNotEmpty({
    message: 'Informe a quantidade',
  })
  @ApiProperty({
    description: 'Quantidade do produto',
    type: 'number',
  })
  quantidade: number;

  @IsNotEmpty({
    message: 'Informe o preço unitário do produto',
  })
  @ApiProperty({
    description: 'Preço unitário do produto',
    type: 'number',
  })
  precoUnitario: number;

  @ApiProperty({
    description: 'Outras despesas do produto',
    type: 'number',
  })
  outrasDespesas: number;

  @ApiProperty({
    description: 'Desconto do produto',
    type: 'number',
  })
  desconto: number;

  @ApiProperty({
    description: 'Valor total do produto',
    type: 'number',
  })
  valorTotal: number;

  @IsNotEmpty({
    message: 'Informe a venda',
  })
  @ApiProperty({
    description: 'Venda vinculada ao produto',
    type: 'number',
  })
  venda: Vendas;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
