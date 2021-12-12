import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePrecosDto {
  @IsNotEmpty({
    message: 'Informe o preco de venda varejo do item',
  })
  @ApiProperty({
    description: 'Preço de venda varejo para cadastro no sistema',
    type: 'number',
  })
  precoVendaVarejo: number;

  @ApiPropertyOptional({
    description: 'Preço de venda atacado para cadastro no sistema',
    type: 'number',
  })
  precoVendaAtacado: number;

  @ApiPropertyOptional({
    description: 'Preço de compra para cadastro no sistema',
    type: 'number',
  })
  precoCompra: number;

  @ApiPropertyOptional({
    description: 'Margem de lucro para cadastro no sistema',
    type: 'number',
  })
  margemLucro: number;
}
