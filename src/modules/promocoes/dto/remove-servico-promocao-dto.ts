import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveServicosPromocaoDto {
  @IsNotEmpty({
    message: 'Informe o id do serviço promoção que será removido',
  })
  @ApiProperty({
    description: 'ID Serviço promoção',
    type: Number,
  })
  servicoPromocao: number;

  @IsNotEmpty({
    message: 'Informe qual serviço será removido da promoção',
  })
  @ApiProperty({
    description: 'Serviço',
    type: String,
  })
  servico: string;
}
