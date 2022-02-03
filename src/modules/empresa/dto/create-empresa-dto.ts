import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateEmpresaDto {
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

  @ApiPropertyOptional({
    type: 'number',
    description: 'Celular para cadastro no sistema',
  })
  celular?: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Telefone para cadastro no sistema',
  })
  telefone?: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'CNPJ para cadastro no sistema',
  })
  cnpj?: string;
}
