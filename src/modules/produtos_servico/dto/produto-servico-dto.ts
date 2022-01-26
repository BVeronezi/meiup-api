import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
import { Produtos } from '../../produtos/produtos.entity';
import { Servicos } from '../../servicos/servicos.entity';

export class ProdutoServicoDto {
  @IsOptional()
  @ApiProperty({
    description: 'Id produto serviço',
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

  @ApiProperty({
    description: 'Produto vinculada ao servico',
    type: 'number',
  })
  servico: Servicos;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
