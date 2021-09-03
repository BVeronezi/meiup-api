import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindUsuariosQueryDto extends BaseQueryParametersDto {
  empresa: number;
  nome: string;
  email: string;
  role: string;
}
