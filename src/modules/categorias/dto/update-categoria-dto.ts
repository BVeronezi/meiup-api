import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoriaDto {
  @ApiPropertyOptional({
    description: 'Nome da categoria para cadastro no sistema',
    type: 'string',
  })
  nome: string;
}
