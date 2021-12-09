import { EntityRepository, Repository } from 'typeorm';
import { Categorias } from './categorias.entity';
import { CreateCategoriaDto } from './dto/create-categoria-dto';

@EntityRepository(Categorias)
export class CategoriasRepository extends Repository<Categorias> {
  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categorias> {
    const { nome } = createCategoriaDto;

    const categoria = this.create();
    categoria.nome = nome;

    try {
      return await categoria.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
