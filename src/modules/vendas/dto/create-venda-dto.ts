import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Clientes } from 'src/modules/clientes/clientes.entity';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Usuario } from 'src/modules/usuario/usuario.entity';

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
  produtos: [{ id: number; quantidade: number }];

  @ApiPropertyOptional({
    description: 'Serviços realizados',
    type: [{}],
  })
  servicos: [{ id: number }];

  @IsNotEmpty({
    message: 'Informe qual a data da venda',
  })
  @ApiProperty({
    description: 'Data da venda',
    type: 'date',
  })
  dataVenda: Date;

  @IsNotEmpty({
    message: 'Informe o valor total da venda',
  })
  @ApiProperty({
    description: 'Valor total',
    type: 'decimal',
  })
  valorTotal: number;

  @IsNotEmpty({
    message: 'Informe o valor do pagamento realizado pelo cliente',
  })
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
