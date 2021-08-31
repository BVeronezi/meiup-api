import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({
    type: 'string',
    description: 'Email utilizado para realizar o login no sistema',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Senha utilizada para realizar o login no sistema',
  })
  senha: string;
}
