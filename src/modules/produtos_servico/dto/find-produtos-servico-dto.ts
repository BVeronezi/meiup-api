import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindProdutosServicoQueryDto extends BaseQueryParametersDto {
  servicoId: number;
}
