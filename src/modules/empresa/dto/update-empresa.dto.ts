import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional } from 'class-validator';
import { Endereco } from '../../endereco/endereco.entity';
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

  @ApiPropertyOptional()
  celular: number;

  @ApiPropertyOptional()
  endereco: Endereco;

  @ApiPropertyOptional()
  telefone: number;

  @IsOptional()
  @ApiProperty()
  @IsDate({
    message: 'Data de alteração do cadastro',
  })
  dataAlteracao: Date;
}
