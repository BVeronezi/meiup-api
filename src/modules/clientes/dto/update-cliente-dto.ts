import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Endereco } from 'src/modules/endereco/endereco.entity';

export class UpdateClienteDto {
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
  celular: number;

  @IsOptional()
  @ApiPropertyOptional()
  telefone: number;

  @IsOptional()
  @ApiPropertyOptional()
  dataNascimento: Date;

  @ApiPropertyOptional({
    description: 'Endereco vinculado ao usuário',
  })
  endereco: Endereco;
}
