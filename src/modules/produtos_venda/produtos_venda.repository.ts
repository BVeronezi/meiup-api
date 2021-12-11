import { EntityRepository, Repository } from 'typeorm';
import { ProdutoVendaDto } from './dto/create-produto-venda-dto';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutosVenda } from './produtos_venda.entity';

@EntityRepository(ProdutosVenda)
export class ProdutosVendaRepository extends Repository<ProdutosVenda> {
  async findProdutosVenda(
    queryDto: FindProdutosVendasQueryDto,
    empresaId: string,
  ) {
    const { vendaId } = queryDto;
    const query = this.createQueryBuilder('produtos_venda');

    query.andWhere('produtos_venda.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('produtos_venda.vendaId = :vendaId', {
      vendaId: vendaId,
    });
    query.select([
      'produtos_venda.id',
      'produtos_venda.quantidade',
      'produtos_venda.produtoId',
      'produtos_venda.vendaId',
      'produtos_venda.empresaId',
    ]);

    const produtosVenda = await query.getRawMany();

    return produtosVenda;
  }

  async createProdutoVenda(
    createProdutoVendaDto: ProdutoVendaDto,
  ): Promise<ProdutosVenda> {
    const { produto, quantidade, venda, empresa } = createProdutoVendaDto;

    const produtosVenda = this.create();
    produtosVenda.produto = produto;
    produtosVenda.quantidade = quantidade;
    produtosVenda.venda = venda;
    produtosVenda.empresa = empresa;

    try {
      return await produtosVenda.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
