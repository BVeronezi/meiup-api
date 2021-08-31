import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(200, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  @ApiProperty({
    description: 'Email para cadastro no sistema',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'Nome para cadastro no sistema',
    type: 'string',
  })
  nome: string;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Celular para cadastro no sistema',
  })
  celular: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Telefone para cadastro no sistema',
  })
  telefone: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'CNPJ para cadastro no sistema',
  })
  cnpj: string;

  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  @ApiProperty({
    type: 'string',
    description: 'Senha para cadastro no sistema',
    minLength: 6,
  })
  senha: string;
}
