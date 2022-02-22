import { EntityRepository, Repository } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Categorias } from './categorias.entity';
import { CreateCategoriaDto } from './dto/create-categoria-dto';
import { FindCategoriasQueryDto } from './dto/find-categorias-query-dto';

@EntityRepository(Categorias)
export class CategoriasRepository extends Repository<Categorias> {
  async findCategorias(
    queryDto: FindCategoriasQueryDto,
    empresaId: string,
  ): Promise<{ categorias: Categorias[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { nome } = queryDto;
    const query = this.createQueryBuilder('categorias');

    query.andWhere('categorias.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (nome) {
      query.andWhere('categorias.nome ILIKE :nome', {
        nome: `%${nome}%`,
      });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['categorias.id', 'categorias.nome']);

    const [categorias, total] = await query.getManyAndCount();

    return { categorias, total };
  }

  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
    empresa: Empresa,
  ): Promise<Categorias> {
    const { nome } = createCategoriaDto;

    const categoria = this.create();
    categoria.nome = nome;
    categoria.empresa = empresa;

    try {
      return await categoria.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
