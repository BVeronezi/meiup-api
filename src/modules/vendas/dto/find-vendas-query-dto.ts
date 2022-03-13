import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindVendasQueryDto extends BaseQueryParametersDto {
  cliente?: string;
  usuario?: string;
  dataInicio?: Date;
  dataFim?: Date;
  valorTotal?: number;
  relatorio?: boolean = false;
}
