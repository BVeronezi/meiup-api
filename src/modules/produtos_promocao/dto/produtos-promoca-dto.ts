import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Promocoes } from 'src/modules/promocoes/promocoes.entity';
import { Empresa } from '../../empresa/empresa.entity';
import { Produtos } from '../../produtos/produtos.entity';

export class ProdutoPromocaoDto {
  @IsOptional()
  @ApiProperty({
    description: 'Id produto promoção',
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
    message: 'Informe a quantidade',
  })
  @ApiProperty({
    description: 'Preço promocional',
    type: 'number',
  })
  precoPromocional: number;

  @ApiProperty({
    description: 'Promoção vinculada ao produto',
    type: 'number',
  })
  promocao: Promocoes;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
