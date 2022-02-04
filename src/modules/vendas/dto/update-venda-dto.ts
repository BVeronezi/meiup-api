import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Clientes } from '../../clientes/clientes.entity';
export class UpdateVendaDto {
  @IsOptional()
  @ApiProperty({
    description: 'Cliente vinculado a venda',
    type: 'number',
  })
  cliente?: Clientes;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Produtos vendidos',
    type: [{}],
  })
  produtos?: any;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Serviços realizados',
    type: [{}],
  })
  servicos?: any;

  @IsOptional()
  @ApiProperty({
    description: 'Valor total',
    type: 'decimal',
  })
  valorTotal?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Valor do pagamento',
    type: 'decimal',
  })
  pagamento?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Valor troco',
    type: 'decimal',
    default: 0,
  })
  valorTroco?: number;
}
