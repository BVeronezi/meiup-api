import { EntityRepository, Repository } from 'typeorm';
import { FindProdutosPromocaoQueryDto } from './dto/find-produtos-promocao-dto';
import { ProdutoPromocaoDto } from './dto/produtos-promoca-dto';
import { ProdutosPromocao } from './produtos_promocao.entity';

@EntityRepository(ProdutosPromocao)
export class ProdutosPromocaoRepository extends Repository<ProdutosPromocao> {
  async findProdutosPromocao(
    queryDto: FindProdutosPromocaoQueryDto,
    empresaId: string,
  ): Promise<{ produtosPromocao: ProdutosPromocao[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { promocaoId } = queryDto;
    const query = this.createQueryBuilder('produtos_promocao');

    query.andWhere('produtos_promocao.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('produtos_promocao.promocaoId = :promocaoId', {
      promocaoId: promocaoId,
    });

    query.skip((Number(queryDto.page) - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'produtos_promocao.id',
      'produto',
      'produtos_promocao.precoPromocional',
    ]);
    query.leftJoin('produtos_promocao.produto', 'produto');

    const [produtosPromocao, total] = await query.getManyAndCount();

    return { produtosPromocao, total };
  }

  async createProdutoPromocao(
    createProdutoPromocaoDto: ProdutoPromocaoDto,
  ): Promise<ProdutosPromocao> {
    const { produto, precoPromocional, promocao, empresa } =
      createProdutoPromocaoDto;

    const produtosPromocao = this.create();
    produtosPromocao.produto = produto;
    produtosPromocao.precoPromocional = precoPromocional;
    produtosPromocao.promocao = promocao;
    produtosPromocao.empresa = empresa;

    try {
      return await produtosPromocao.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProdutoPromocao(
    updateProdutoPromocaoDto: ProdutoPromocaoDto,
  ): Promise<ProdutosPromocao> {
    const { id, produto, precoPromocional } = updateProdutoPromocaoDto;

    try {
      await this.update(
        { id },
        {
          produto,
          precoPromocional,
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }

    return;
  }
}
