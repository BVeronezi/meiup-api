import { ApiProperty } from '@nestjs/swagger';
import { Servicos } from '../servicos.entity';

export class ReturnServicosDto {
  @ApiProperty()
  servico: Servicos;

  @ApiProperty()
  message: string;
}
