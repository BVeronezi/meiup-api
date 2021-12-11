import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindServicosVendasQueryDto extends BaseQueryParametersDto {
  vendaId: number;
}
