import { Categorias } from '../../categorias/categorias.entity';
import { Precos } from '../../precos/precos.entity';
import { BaseQueryParametersDto } from '../../../shared/dto/base-query-parameters.dto';
export class FindProdutosQueryDto extends BaseQueryParametersDto {
  descricao: string;
  categoria: Categorias;
  precos: Precos;
}
