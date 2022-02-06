import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Endereco } from '../../endereco/endereco.entity';

export class UpdateFornecedorDto {
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
  @ApiProperty()
  cpfCnpj?: string;

  @IsOptional()
  @ApiProperty()
  situacaoCadastral?: string;

  @IsOptional()
  @ApiPropertyOptional()
  celular?: string;

  @IsOptional()
  @ApiPropertyOptional()
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Endereco vinculado ao fornecedor',
  })
  endereco?: Endereco;
}
