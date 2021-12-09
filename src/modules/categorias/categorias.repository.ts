import { EntityRepository, Repository } from 'typeorm';
import { Categorias } from './categorias.entity';
import { CreateCategoriaDto } from './dto/create-categoria-dto';

@EntityRepository(Categorias)
export class CategoriasRepository extends Repository<Categorias> {
  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categorias> {
    const { nome, empresa } = createCategoriaDto;

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
