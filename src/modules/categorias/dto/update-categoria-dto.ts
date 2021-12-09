import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCategoriaDto {
  @IsOptional()
  @ApiProperty({
    description: 'Nome da categoria para cadastro no sistema',
    type: 'string',
  })
  nome: string;
}
