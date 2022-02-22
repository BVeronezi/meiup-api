import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindPromocoesQueryDto extends BaseQueryParametersDto {
  descricao?: string;
  produtoId?: string;
  promocaoId?: string;
}
