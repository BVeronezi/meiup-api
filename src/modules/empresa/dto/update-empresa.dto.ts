import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { CreateEnderecoDto } from 'src/modules/endereco/dto/create-endereco.dto';

export class UpdateEmpresaDto {
  @IsOptional()
  @ApiProperty()
  razaoSocial: string;

  @IsOptional()
  @ApiProperty()
  cnpj: string;

  @IsOptional()
  @ApiProperty()
  ie: number;

  @IsOptional()
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  email: string;

  @IsOptional()
  @ApiPropertyOptional()
  celular: number;

  @IsOptional()
  @ApiPropertyOptional()
  endereco: CreateEnderecoDto;

  @IsOptional()
  @ApiPropertyOptional()
  telefone: number;
}
