import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnderecoDto {
  @ApiPropertyOptional()
  cep: string;

  @ApiPropertyOptional()
  endereco: string;

  @ApiPropertyOptional()
  estado: string;

  @ApiPropertyOptional()
  numero: string;

  @ApiPropertyOptional()
  bairro: string;

  @ApiPropertyOptional()
  cidade: string;

  @ApiPropertyOptional()
  complemento: string;

  @ApiPropertyOptional()
  usuarioId: string;
}
