import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Empresa } from 'src/modules/empresa/empresa.entity';
export class CreateServicosDto {
  @IsNotEmpty({
    message: 'Informe um nome para o serviço',
  })
  @ApiProperty({
    description: 'Nome do serviço para cadastro no sistema',
    type: 'string',
  })
  nome: string;

  @ApiPropertyOptional({
    description: 'Custo do serviço',
    type: 'number',
  })
  custo: number;

  @IsNotEmpty({
    message: 'Informe qual o valor do serviço',
  })
  @ApiProperty({
    description: 'Valor do serviço',
    type: 'number',
  })
  valor: number;

  @ApiPropertyOptional({
    description: 'Margem de lucro do serviço',
    type: 'number',
  })
  margemLucro: number;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
