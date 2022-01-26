import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
import { Servicos } from '../../servicos/servicos.entity';
import { Vendas } from '../../vendas/vendas.entity';

export class ServicoVendaDto {
  @IsOptional()
  @ApiProperty({
    description: 'Id servico venda',
    type: 'string',
  })
  id: string;

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
    description: 'Valor do serviço',
    type: 'number',
  })
  valorServico: number;

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
