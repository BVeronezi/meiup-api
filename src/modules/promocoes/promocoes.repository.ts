import { EntityRepository, Repository } from 'typeorm';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { FindPromocoesQueryDto } from './dto/find-promocoes-query-dto';
import { Promocoes } from './promocoes.entity';

@EntityRepository(Promocoes)
export class PromocoesRepository extends Repository<Promocoes> {
  async findPromocoes(
    queryDto: FindPromocoesQueryDto,
    empresaId: string,
  ): Promise<{ promocoes: Promocoes[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { descricao } = queryDto;
    const query = this.createQueryBuilder('promocoes');

    query.andWhere('promocoes.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (descricao) {
      query.andWhere('promocoes.descricao ILIKE :descricao', {
        descricao: `%${descricao}%`,
      });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['promocoes.id', 'promocoes.descricao']);

    const [promocoes, total] = await query.getManyAndCount();

    return { promocoes, total };
  }

  async createPromocao(
    createPromocaoDto: CreatePromocaoDto,
  ): Promise<Promocoes> {
    const { descricao, produtos, servicos, dataInicio, dataFim } =
      createPromocaoDto;

    const promocao = this.create();
    promocao.descricao = descricao;
    promocao.produtos = produtos;
    promocao.servicos = servicos;
    promocao.dataInicio = dataInicio;
    promocao.dataFim = dataFim;

    try {
      return await promocao.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
