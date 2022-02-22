import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Empresa } from '../../empresa/empresa.entity';
import { Endereco } from '../../endereco/endereco.entity';

export class CreateFornecedorDto {
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

  @IsNotEmpty({
    message: 'Informe o nome do fornecedor',
  })
  @ApiProperty({
    description: 'Nome para cadastro no sistema',
    type: 'string',
  })
  nome: string;

  @ApiPropertyOptional({
    description: 'CPF/CNPJ para cadastro no sistema',
    type: 'string',
  })
  cpfCnpj: string;

  @ApiPropertyOptional({
    description: 'Situação cadastral do fornecedor junto a Receita Federal',
    type: 'string',
  })
  situacaoCadastral: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Celular para cadastro no sistema',
  })
  celular?: string;

  @ApiPropertyOptional({
    type: 'string',
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
