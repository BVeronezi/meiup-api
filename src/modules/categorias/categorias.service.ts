import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorias } from './categorias.entity';
import { CategoriasRepository } from './categorias.repository';
import { CreateCategoriaDto } from './dto/create-categoria-dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(CategoriasRepository)
    private categoriasRepository: CategoriasRepository,
  ) {}

  async findCategoriaById(categoriaId: number): Promise<Categorias> {
    const categoria = await this.categoriasRepository.findOne(categoriaId);

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    return categoria;
  }

  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categorias> {
    return await this.categoriasRepository.createCategoria(createCategoriaDto);
  }

  async deleteCategoria(categoriaId: number) {
    const result = await this.categoriasRepository.delete({ id: categoriaId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrada categoria com o ID informado',
      );
    }
  }
}
