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
    description: 'Venda vinculada ao produto',
    type: 'number',
  })
  venda: Vendas;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
