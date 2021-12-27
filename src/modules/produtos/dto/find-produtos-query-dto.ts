import { Categorias } from 'src/modules/categorias/categorias.entity';
import { Precos } from 'src/modules/precos/precos.entity';
import { BaseQueryParametersDto } from 'src/shared/dto/base-query-parameters.dto';

export class FindProdutosQueryDto extends BaseQueryParametersDto {
  descricao: string;
  categoria: Categorias;
  precos: Precos;
}
