import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindProdutosQueryDto extends BaseQueryParametersDto {
  descricao: string;
}
