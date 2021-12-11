import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindProdutosVendasQueryDto extends BaseQueryParametersDto {
  vendaId: number;
}
