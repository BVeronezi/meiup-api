import { EntityRepository, Repository } from 'typeorm';
import { ProdutoServicoDto } from './dto/create-produto-servico-dto';
import { FindProdutosServicoQueryDto } from './dto/find-produtos-servico-dto';
import { ProdutosServico } from './produtos_servico.entity';

@EntityRepository(ProdutosServico)
export class ProdutosServicoRepository extends Repository<ProdutosServico> {
  async findProdutosServico(
    queryDto: FindProdutosServicoQueryDto,
    empresaId: string,
  ) {
    const { servicoId } = queryDto;
    const query = this.createQueryBuilder('produtos_servico');

    query.andWhere('produtos_servico.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('produtos_servico.servicoId = :servicoId', {
      servicoId: servicoId,
    });
    query.select([
      'produtos_servico.id',
      'produtos_servico.quantidade',
      'produtos_servico.produtoId',
      'produtos_servico.servicoId',
      'produtos_servico.empresaId',
    ]);

    const produtosServicos = await query.getRawMany();

    return produtosServicos;
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
}
