import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindVendasQueryDto extends BaseQueryParametersDto {
  cliente?: string;
  dataVenda?: Date;
  valorTotal?: number;
}
