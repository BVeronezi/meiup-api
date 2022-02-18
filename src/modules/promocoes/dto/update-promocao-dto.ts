import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class UpdatePromocaoDto {
  @IsOptional()
  @ApiProperty({
    description: 'Descrição da promoção',
    type: 'string',
  })
  descricao?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Produtos em promoção',
    type: [{}],
  })
  produtos?: any;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Serviços em promoção',
    type: [{}],
  })
  servicos?: any;

  @IsOptional()
  @ApiProperty({
    description: 'Data inicio da promoção',
    type: 'date',
  })
  dataInicio?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Data fim da promoção',
    type: 'date',
  })
  dataFim?: Date;
}
