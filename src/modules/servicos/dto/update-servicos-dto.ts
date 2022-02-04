import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateServicosDto {
  @IsOptional()
  @ApiProperty({
    description: 'Nome do serviço para cadastro no sistema',
    type: 'string',
  })
  nome?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Custo do serviço',
    type: 'number',
  })
  custo?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Valor do serviço',
    type: 'number',
  })
  valor?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Margem de lucro do serviço',
    type: 'number',
  })
  margemLucro?: number;

  @ApiPropertyOptional({
    description: 'Produtos utilizados',
    type: 'number',
  })
  produto?: number;
}
