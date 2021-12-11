import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Produtos } from 'src/modules/produtos/produtos.entity';
import { Servicos } from 'src/modules/servicos/servicos.entity';

export class ProdutoServicoDto {
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
    message: 'Informe o servico',
  })
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
