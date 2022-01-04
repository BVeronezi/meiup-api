import { EntityRepository, Repository } from 'typeorm';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutoVendaDto } from './dto/produto-venda-dto';
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
    const {
      produto,
      quantidade,
      precoUnitario,
      outrasDespesas,
      desconto,
      valorTotal,
      venda,
      empresa,
    } = createProdutoVendaDto;

    const produtosVenda = this.create();
    produtosVenda.produto = produto;
    produtosVenda.quantidade = Number(quantidade);
    produtosVenda.precoUnitario = Number(precoUnitario);
    produtosVenda.outrasDespesas = Number(outrasDespesas);
    produtosVenda.desconto = Number(desconto);
    produtosVenda.valorTotal = +Number(valorTotal);
    produtosVenda.venda = venda;
    produtosVenda.empresa = empresa;

    try {
      return await produtosVenda.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProdutoVenda(
    updateProdutoVendaDto: ProdutoVendaDto,
  ): Promise<ProdutosVenda> {
    const {
      id,
      produto,
      quantidade,
      precoUnitario,
      outrasDespesas,
      desconto,
      valorTotal,
    } = updateProdutoVendaDto;

    try {
      await this.update(
        { id },
        {
          produto,
          quantidade,
          precoUnitario,
          outrasDespesas,
          desconto,
          valorTotal,
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }

    return;
  }
}
