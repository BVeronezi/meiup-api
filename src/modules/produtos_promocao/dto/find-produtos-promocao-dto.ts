import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindProdutosPromocaoQueryDto extends BaseQueryParametersDto {
  promocaoId?: string;
  produtoId?: string;
}
