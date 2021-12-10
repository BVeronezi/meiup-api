import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Endereco } from 'src/modules/endereco/endereco.entity';

export class UpdateClienteDto {
  @IsOptional()
  @ApiProperty()
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