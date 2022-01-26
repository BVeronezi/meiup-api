import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Clientes } from '../../clientes/clientes.entity';
import { Empresa } from '../../empresa/empresa.entity';
import { Usuario } from '../../usuario/usuario.entity';
export class CreateVendaDto {
  @IsNotEmpty({
    message: 'Informe qual o cliente',
  })
  @ApiProperty({
    description: 'Cliente vinculado a venda',
    type: 'number',
  })
  cliente: Clientes;

  @ApiPropertyOptional({
    description: 'Produtos vendidos',
    type: [{}],
  })
  produtos: any;

  @ApiPropertyOptional({
    description: 'Serviços realizados',
    type: [{}],
  })
  servicos: any;

  @IsNotEmpty({
    message: 'Informe qual a data da venda',
  })
  @ApiProperty({
    description: 'Data da venda',
    type: 'date',
  })
  dataVenda: Date;

  @ApiProperty({
    description: 'Valor total',
    type: 'decimal',
  })
  valorTotal: number;

  @ApiProperty({
    description: 'Valor do pagamento',
    type: 'decimal',
  })
  pagamento: number;

  @ApiProperty({
    description: 'Valor troco',
    type: 'decimal',
    default: 0,
  })
  valorTroco: number;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;

  @ApiProperty({
    description: 'Usuario que criou a venda',
  })
  usuario: Usuario;
}
