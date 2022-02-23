import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindProdutosFornecedoresQueryDto extends BaseQueryParametersDto {
  produtoId?: string;
  fornecedorId?: string;
}
