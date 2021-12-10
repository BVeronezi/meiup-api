import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Clientes } from 'src/modules/clientes/clientes.entity';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Produtos } from 'src/modules/produtos/produtos.entity';
import { Servicos } from 'src/modules/servicos/servicos.entity';

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
    type: [Number],
  })
  produtos: Produtos[];

  @ApiPropertyOptional({
    description: 'Serviços realizados',
    type: [Number],
  })
  servicos: Servicos[];

  @IsNotEmpty({
    message: 'Informe qual a data da venda',
  })
  @ApiProperty({
    description: 'Data da venda',
    type: 'date',
  })
  dataVenda: Date;

  @IsNotEmpty({
    message: 'Informe o valor do pagamento realizado pelo cliente',
  })
  @ApiProperty({
    description: 'Valor do pagamento',
    type: 'decimal',
  })
  pagamento: number;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
