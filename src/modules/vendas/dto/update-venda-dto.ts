import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Clientes } from 'src/modules/clientes/clientes.entity';
export class UpdateVendaDto {
  @IsOptional()
  @ApiProperty({
    description: 'Cliente vinculado a venda',
    type: 'number',
  })
  cliente: Clientes;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Produtos vendidos',
    type: [{}],
  })
  produtos: [{ id: number; quantidade: number }];

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Serviços realizados',
    type: [{}],
  })
  servicos: [{ id: number }];

  @IsOptional()
  @ApiProperty({
    description: 'Valor total',
    type: 'decimal',
  })
  valorTotal: number;

  @IsOptional()
  @ApiProperty({
    description: 'Valor do pagamento',
    type: 'decimal',
  })
  pagamento: number;

  @IsOptional()
  @ApiProperty({
    description: 'Valor troco',
    type: 'decimal',
    default: 0,
  })
  valorTroco: number;
}
