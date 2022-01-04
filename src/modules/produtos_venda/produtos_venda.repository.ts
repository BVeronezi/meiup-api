import { EntityRepository, Repository } from 'typeorm';
import { ProdutoVendaDto } from './dto/create-produto-venda-dto';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutosVenda } from './produtos_venda.entity';

@EntityRepository(ProdutosVenda)
export class ProdutosVendaRepository extends Repository<ProdutosVenda> {
  async findProdutosVenda(
    queryDto: FindProdutosVendasQueryDto,
    empresaId: string,
  ): Promise<{ produtosVenda: ProdutosVenda[]; total: number }> {
    const { vendaId } = queryDto;
    const query = this.createQueryBuilder('produtos_venda');

    query.andWhere('produtos_venda.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('produtos_venda.vendaId = :vendaId', {
      vendaId: vendaId,
    });

    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'produtos_venda.id',
      'produto',
      'produtos_venda.quantidade',
      'produtos_venda.precoUnitario',
      'produtos_venda.outrasDespesas',
      'produtos_venda.desconto',
      'produtos_venda.valorTotal',
      'produtos_venda.vendaId',
      'produtos_venda.empresaId',
    ]);
    query.leftJoin('produtos_venda.produto', 'produto');

    const [produtosVenda, total] = await query.getManyAndCount();

    return { produtosVenda, total };
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
