import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveServicoVendaDto {
  @IsNotEmpty({
    message: 'Informe quail serviço será removido da venda',
  })
  @ApiProperty({
    description: 'Serviços',
    type: Number,
  })
  servico: number;
}
