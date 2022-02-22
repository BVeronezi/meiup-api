import { EntityRepository, Repository } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { CreateServicosDto } from './dto/create-servicos-dto';
import { FindServicosQueryDto } from './dto/find-servicos-query-dto';
import { Servicos } from './servicos.entity';

@EntityRepository(Servicos)
export class ServicosRepository extends Repository<Servicos> {
  async findServicos(
    queryDto: FindServicosQueryDto,
    empresaId: string,
  ): Promise<{ servicos: Servicos[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { nome } = queryDto;
    const query = this.createQueryBuilder('servicos');

    query.andWhere('servicos.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (nome) {
      query.andWhere('servicos.nome ILIKE :nome', {
        nome: `%${nome}%`,
      });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'servicos.id',
      'servicos.nome',
      'servicos.custo',
      'servicos.valor',
      'servicos.margemLucro',
    ]);

    const [servicos, total] = await query.getManyAndCount();

    return { servicos, total };
  }

  async createServico(
    createServicosDto: CreateServicosDto,
    empresa: Empresa,
  ): Promise<Servicos> {
    const { nome } = createServicosDto;

    const servico = this.create();
    servico.nome = nome;
    servico.empresa = empresa;

    try {
      return await servico.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
