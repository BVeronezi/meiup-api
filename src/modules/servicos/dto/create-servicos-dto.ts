import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
export class CreateServicosDto {
  @IsNotEmpty({
    message: 'Informe um nome para o serviço',
  })
  @ApiProperty({
    description: 'Nome do serviço para cadastro no sistema',
    type: 'string',
  })
  nome: string;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
