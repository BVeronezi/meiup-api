import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindAgendaQueryDto extends BaseQueryParametersDto {
  titulo?: string;
  descricao?: string;
}
