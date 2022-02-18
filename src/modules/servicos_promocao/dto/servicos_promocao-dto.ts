import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Promocoes } from 'src/modules/promocoes/promocoes.entity';
import { Servicos } from 'src/modules/servicos/servicos.entity';
import { Empresa } from '../../empresa/empresa.entity';

export class ServicoPromocaoDto {
  @IsOptional()
  @ApiProperty({
    description: 'Id produto promoção',
    type: 'string',
  })
  id?: string;

  @IsNotEmpty({
    message: 'Informe o serviço',
  })
  @ApiProperty({
    description: 'Serviço',
    type: 'number',
  })
  servico: Servicos;

  @IsNotEmpty({
    message: 'Informe a quantidade',
  })
  @ApiProperty({
    description: 'Preço promocional',
    type: 'number',
  })
  precoPromocional: number;

  @ApiProperty({
    description: 'Promoção vinculada ao produto',
    type: 'number',
  })
  promocao: Promocoes;

  @ApiProperty({
    description: 'Empresa vinculada ao item',
  })
  empresa: Empresa;
}
