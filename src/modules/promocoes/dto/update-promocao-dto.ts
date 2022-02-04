import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Produtos } from '../../produtos/produtos.entity';
import { Servicos } from '../../servicos/servicos.entity';

export class UpdatePromocaoDto {
  @IsOptional()
  @ApiProperty({
    description: 'Descrição da promoção',
    type: 'string',
  })
  descricao: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Produtos em promoção',
    type: 'number',
  })
  produtos: Produtos;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Serviços em promoção',
    type: 'number',
  })
  servicos: Servicos;

  @IsOptional()
  @ApiProperty({
    description: 'Valor promocional',
    type: 'decimal',
  })
  valorPromocional: number;

  @IsOptional()
  @ApiProperty({
    description: 'Data inicio da promoção',
    type: 'date',
  })
  dataInicio: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Data fim da promoção',
    type: 'date',
  })
  dataFim: Date;
}
