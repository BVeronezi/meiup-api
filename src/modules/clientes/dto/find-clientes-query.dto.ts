import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindClientesQueryDto extends BaseQueryParametersDto {
  nome: string;
  email: string;
}
