import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';

export class FindFornecedoresQueryDto extends BaseQueryParametersDto {
  nome: string;
  cpfCnpj: number;
  email: string;
}
