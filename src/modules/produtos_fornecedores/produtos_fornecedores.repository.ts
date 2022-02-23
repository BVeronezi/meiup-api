import { EntityRepository, Repository } from 'typeorm';
import { FindProdutosFornecedoresQueryDto } from './dto/find-produtos-fornecedores-dto';
import { ProdutoFornecedorDto } from './dto/produto-fornecedor-dto';
import { ProdutosFornecedores } from './produtos_fornecedores.entity';

@EntityRepository(ProdutosFornecedores)
export class ProdutosFornecedoresRepository extends Repository<ProdutosFornecedores> {
  async findProdutosFornecedores(
    queryDto: FindProdutosFornecedoresQueryDto,
    empresaId: string,
  ): Promise<{ produtosFornecedores: ProdutosFornecedores[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { produtoId, fornecedorId } = queryDto;
    const query = this.createQueryBuilder('produtos_fornecedores');

    query.andWhere('produtos_fornecedores.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (fornecedorId) {
      query.andWhere('produtos_fornecedores.fornecedorId = :fornecedorId', {
        fornecedorId: fornecedorId,
      });
    } else {
      query.andWhere('produtos_fornecedores.produtoId = :produtoId', {
        produtoId: produtoId,
      });
    }

    query.skip((Number(queryDto.page) - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'produtos_fornecedores.id',
      'produto',
      'fornecedor',
      'produtos_fornecedores.empresaId',
    ]);
    query.leftJoin('produtos_fornecedores.produto', 'produto');
    query.leftJoin('produtos_fornecedores.fornecedor', 'fornecedor');

    const [produtosFornecedores, total] = await query.getManyAndCount();

    return { produtosFornecedores, total };
  }

  async createProdutoFornecedor(
    createProdutoFornecedorDto: ProdutoFornecedorDto,
  ): Promise<ProdutosFornecedores> {
    const { produto, fornecedor, empresa } = createProdutoFornecedorDto;

    const produtosFornecedor = this.create();
    produtosFornecedor.produto = produto;
    produtosFornecedor.fornecedor = fornecedor;
    produtosFornecedor.empresa = empresa;

    try {
      return await produtosFornecedor.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
