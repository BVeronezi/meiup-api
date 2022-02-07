import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindUsuariosQueryDto extends BaseQueryParametersDto {
  nome: string;
  email: string;
  tipo?: string;
}
