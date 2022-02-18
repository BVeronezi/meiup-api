import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
export class CreatePromocaoDto {
  @IsNotEmpty({
    message: 'Informe qual a descrição da promoção',
  })
  @ApiProperty({
    description: 'Descrição da promoção',
    type: 'string',
  })
  descricao: string;

  @ApiPropertyOptional({
    description: 'Produtos em promoção',
    type: [{}],
  })
  produtos?: any;

  @ApiPropertyOptional({
    description: 'Serviços em promoção',
    type: [{}],
  })
  servicos?: any;

  @IsNotEmpty({
    message: 'Informe qual a data de inicio da promoção',
  })
  @ApiProperty({
    description: 'Data inicio da promoção',
    type: 'date',
  })
  dataInicio: Date;

  @IsNotEmpty({
    message: 'Informe qual a data de fim da promoção',
  })
  @ApiProperty({
    description: 'Data fim da promoção',
    type: 'date',
  })
  dataFim: Date;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
