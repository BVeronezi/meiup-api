import { ApiPropertyOptional } from '@nestjs/swagger';
import { Empresa } from 'src/modules/empresa/empresa.entity';

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
  empresa: Empresa;
}
