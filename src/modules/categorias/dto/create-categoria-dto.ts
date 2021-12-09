import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Empresa } from 'src/modules/empresa/empresa.entity';

export class CreateCategoriaDto {
  @IsNotEmpty({
    message: 'Informe um nome para a categoria',
  })
  @ApiProperty({
    description: 'Nome da categoria para cadastro no sistema',
    type: 'string',
  })
  nome: string;

  @ApiProperty({
    description: 'Empresa vinculada a categoria',
  })
  empresa: Empresa;
}
