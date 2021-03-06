import { EntityRepository, Repository } from 'typeorm';
import { Categorias } from '../categorias/categorias.entity';
import { Empresa } from '../empresa/empresa.entity';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { Produtos } from './produtos.entity';

@EntityRepository(Produtos)
export class ProdutosRepository extends Repository<Produtos> {
  async findProdutos(
    queryDto: FindProdutosQueryDto,
    empresaId: string,
  ): Promise<{ produtos: Produtos[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { descricao } = queryDto;
    const query = this.createQueryBuilder('produtos');

    query.andWhere('produtos.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (descricao) {
      query.andWhere('produtos.descricao ILIKE :descricao', {
        descricao: `%${descricao}%`,
      });
    }

    query.skip((Number(queryDto.page) - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['produtos.id', 'produtos.descricao', 'categoria', 'precos']);
    query.leftJoin('produtos.categoria', 'categoria');
    query.leftJoin('produtos.precos', 'precos');

    const [produtos, total] = await query.getManyAndCount();

    return { produtos, total };
  }

  async createProduto(
    createProdutoDto: CreateProdutoDto,
    categoria: Categorias,
    empresa: Empresa,
  ): Promise<Produtos> {
    const {
      descricao,
      tipoItem,
      unidade,
      estoque,
      estoqueMinimo,
      estoqueMaximo,
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
