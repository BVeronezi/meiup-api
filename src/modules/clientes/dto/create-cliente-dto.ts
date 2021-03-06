import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
import { Endereco } from '../../endereco/endereco.entity';

export class CreateClienteDto {
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
    description: 'Data de nascimento para cadastro no sistema',
    type: 'date',
  })
  dataNascimento?: Date;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Celular para cadastro no sistema',
  })
  celular?: string;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Telefone para cadastro no sistema',
  })
  telefone?: string;

  @ApiProperty({
    description: 'Empresa vinculada ao usuário',
  })
  empresa: Empresa;

  @ApiPropertyOptional({
    description: 'Endereco vinculado ao usuário',
  })
  endereco?: Endereco;
}
