import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Endereco } from '../../endereco/endereco.entity';

export class UpdateClienteDto {
  @IsOptional()
  @ApiProperty()
  nome?: string;

  @IsOptional()
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  email?: string;

  @IsOptional()
  @ApiPropertyOptional()
  celular?: string;

  @IsOptional()
  @ApiPropertyOptional()
  telefone?: string;

  @IsOptional()
  @ApiPropertyOptional()
  dataNascimento?: Date;

  @ApiPropertyOptional({
    description: 'Endereco vinculado ao cliente',
  })
  endereco?: Endereco;
}
