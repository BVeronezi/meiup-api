import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindServicosPromocaoQueryDto extends BaseQueryParametersDto {
  promocaoId?: string;
  servicoId?: string;
}
