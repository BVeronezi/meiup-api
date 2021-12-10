import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindPromocoesQueryDto extends BaseQueryParametersDto {
  descricao: string;
}
