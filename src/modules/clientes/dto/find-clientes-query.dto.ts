import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindClientesQueryDto extends BaseQueryParametersDto {
  nome: string;
  email: string;
}
