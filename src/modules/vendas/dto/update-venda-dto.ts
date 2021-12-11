import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Clientes } from 'src/modules/clientes/clientes.entity';
import { Servicos } from 'src/modules/servicos/servicos.entity';

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
    type: [Number],
  })
  servicos: Servicos[];

  @IsOptional()
  @ApiProperty({
    description: 'Valor do pagamento',
    type: 'decimal',
  })
  pagamento: number;
}
