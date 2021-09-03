import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
import { Endereco } from 'src/modules/endereco/endereco.entity';
import { UserRole } from '../enum/user-roles.enum';

export class UpdateUsuarioDto {
  @IsOptional()
  @ApiProperty()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  nome: string;

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
  role: UserRole;

  @IsOptional()
  @ApiPropertyOptional()
  celular: number;

  @IsOptional()
  @ApiPropertyOptional()
  telefone: number;

  @ApiPropertyOptional({
    description: 'Endereco vinculado ao usuário',
  })
  endereco: Endereco;

  @IsOptional()
  @ApiProperty()
  @IsDate({
    message: 'Data de alteração do cadastro',
  })
  dataAlteracao: Date;
}
