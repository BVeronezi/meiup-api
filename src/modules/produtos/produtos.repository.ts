import { EntityRepository, Repository } from 'typeorm';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { Produtos } from './produtos.entity';

@EntityRepository(Produtos)
export class ProdutosRepository extends Repository<Produtos> {
  async createProduto(createProdutoDto: CreateProdutoDto): Promise<Produtos> {
    const {
      descricao,
      tipoItem,
      unidade,
      categoria,
      estoque,
      estoqueMinimo,
      estoqueMaximo,
      empresa,
    } = createProdutoDto;

    const produto = this.create();
    produto.descricao = descricao;
    produto.tipoItem = tipoItem;
    produto.unidade = unidade;
    produto.categoria = categoria;
    produto.empresa = empresa;
    produto.estoque = estoque ?? 0;
    produto.estoqueMinimo = estoqueMinimo ?? 0;
    produto.estoqueMaximo = estoqueMaximo ?? 0;

    try {
      return await produto.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
