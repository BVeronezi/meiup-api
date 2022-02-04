import { EntityRepository, Repository } from 'typeorm';
import { FindProdutosServicoQueryDto } from './dto/find-produtos-servico-dto';
import { ProdutoServicoDto } from './dto/produto-servico-dto';
import { ProdutosServico } from './produtos_servico.entity';
@EntityRepository(ProdutosServico)
export class ProdutosServicoRepository extends Repository<ProdutosServico> {
  async findProdutosServico(
    queryDto: FindProdutosServicoQueryDto,
    empresaId: string,
  ): Promise<{ produtosServico: ProdutosServico[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { servicoId } = queryDto;
    const query = this.createQueryBuilder('produtos_servico');

    query.andWhere('produtos_servico.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('produtos_servico.servicoId = :servicoId', {
      servicoId: servicoId,
    });

    query.skip((Number(queryDto.page) - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'produtos_servico.id',
      'produto',
      'servico',
      'produtos_servico.quantidade',
      'produtos_servico.empresaId',
    ]);
    query.leftJoin('produtos_servico.produto', 'produto');
    query.leftJoin('produtos_servico.servico', 'servico');

    const [produtosServico, total] = await query.getManyAndCount();

    return { produtosServico, total };
  }

  async createProdutoServico(
    createProdutoServicoDto: ProdutoServicoDto,
  ): Promise<ProdutosServico> {
    const { produto, quantidade, servico, empresa } = createProdutoServicoDto;

    const produtosServico = this.create();
    produtosServico.produto = produto;
    produtosServico.quantidade = quantidade;
    produtosServico.servico = servico;
    produtosServico.empresa = empresa;

    try {
      return await produtosServico.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProdutoServico(
    updateProdutoVendaDto: ProdutoServicoDto,
  ): Promise<ProdutosServico> {
    const { id, produto, quantidade } = updateProdutoVendaDto;

    try {
      await this.update(
        { id },
        {
          produto,
          quantidade,
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }

    return;
  }
}
