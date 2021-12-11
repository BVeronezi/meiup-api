import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveServicoVendaDto {
  @IsNotEmpty({
    message: 'Informe quais serviços serão removidos da venda',
  })
  @ApiProperty({
    description: 'Serviços',
    type: [Number],
  })
  servicos: [number];
}
