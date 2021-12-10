import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindVendasQueryDto extends BaseQueryParametersDto {
  cliente: string;
  dataVenda: Date;
}