import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindServicosQueryDto extends BaseQueryParametersDto {
  nome: string;
}
