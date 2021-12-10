import { ApiProperty } from '@nestjs/swagger';
import { Fornecedores } from '../fornecedores.entity';

export class ReturnFornecedorDto {
  @ApiProperty()
  fornecedor: Fornecedores;

  @ApiProperty()
  message: string;
}
