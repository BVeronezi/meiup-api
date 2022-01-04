import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Servicos } from 'src/modules/servicos/servicos.entity';
import { Vendas } from 'src/modules/vendas/vendas.entity';

export class ServicoVendaDto {
  @IsNotEmpty({
    message: 'Informe o serviço',
  })
  @ApiProperty({
    description: 'Serviço',
    type: 'number',
  })
  servico: Servicos;

  @IsNotEmpty({
    message: 'Informe a venda',
  })
  @ApiProperty({
    description: 'Venda vinculada ao serviço',
    type: 'number',
  })
  venda: Vendas;

  @IsNotEmpty({
    message: 'Informe o preço unitário do serviço',
  })
  @ApiProperty({
    description: 'Preço unitário do serviço',
    type: 'number',
  })
  precoUnitario: number;

  @ApiProperty({
    description: 'Outras despesas do serviço',
    type: 'number',
  })
  outrasDespesas: number;

  @ApiProperty({
    description: 'Desconto do serviço',
    type: 'number',
  })
  desconto: number;

  @ApiProperty({
    description: 'Valor total do serviço',
    type: 'number',
  })
  valorTotal: number;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
