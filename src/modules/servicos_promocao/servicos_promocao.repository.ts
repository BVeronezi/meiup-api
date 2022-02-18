import { EntityRepository, Repository } from 'typeorm';
import { FindServicosPromocaoQueryDto } from './dto/find-servicos_promocao-dto';
import { ServicoPromocaoDto } from './dto/servicos_promocao-dto';
import { ServicosPromocao } from './servicos_promocao.entity';

@EntityRepository(ServicosPromocao)
export class ServicosPromocaoRepository extends Repository<ServicosPromocao> {
  async findServicosPromocao(
    queryDto: FindServicosPromocaoQueryDto,
    empresaId: string,
  ): Promise<{ servicosPromocao: ServicosPromocao[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { promocaoId } = queryDto;
    const query = this.createQueryBuilder('servicos_promocao');

    query.andWhere('servicos_promocao.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('servicos_promocao.promocaoId = :promocaoId', {
      promocaoId: promocaoId,
    });

    query.skip((Number(queryDto.page) - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'servicos_promocao.id',
      'servico',
      'promocao',
      'servicos_promocao.precoPromocional',
      'servicos_promocao.empresaId',
    ]);
    query.leftJoin('servicos_promocao.servico', 'servico');
    query.leftJoin('servicos_promocao.promocoes', 'promocao');

    const [servicosPromocao, total] = await query.getManyAndCount();

    return { servicosPromocao, total };
  }

  async createServicoPromocao(
    createServicoPromocaoDto: ServicoPromocaoDto,
  ): Promise<ServicosPromocao> {
    const { servico, precoPromocional, promocao, empresa } =
      createServicoPromocaoDto;

    const servicosPromocao = this.create();
    servicosPromocao.servico = servico;
    servicosPromocao.precoPromocional = precoPromocional;
    servicosPromocao.promocao = promocao;
    servicosPromocao.empresa = empresa;

    try {
      return await servicosPromocao.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateServicoPromocao(
    updateServicoPromocaoDto: ServicoPromocaoDto,
  ): Promise<ServicosPromocao> {
    const { id, servico, precoPromocional } = updateServicoPromocaoDto;

    try {
      await this.update(
        { id },
        {
          servico,
          precoPromocional,
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }

    return;
  }
}
