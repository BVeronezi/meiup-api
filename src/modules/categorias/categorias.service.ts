import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Categorias } from './categorias.entity';
import { CategoriasRepository } from './categorias.repository';
import { CreateCategoriaDto } from './dto/create-categoria-dto';
import { FindCategoriasQueryDto } from './dto/find-categorias-query-dto';
import { UpdateCategoriaDto } from './dto/update-categoria-dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(CategoriasRepository)
    private categoriasRepository: CategoriasRepository,
  ) {}

  async findCategoriaById(categoriaId: string): Promise<Categorias> {
    const categoria = await this.categoriasRepository.findOne(categoriaId);

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    return categoria;
  }

  async findCategorias(
    queryDto: FindCategoriasQueryDto,
    empresaId: string,
  ): Promise<{ categorias: Categorias[]; total: number }> {
    const categorias = await this.categoriasRepository.findCategorias(
      queryDto,
      empresaId,
    );
    return categorias;
  }

  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
    empresa: Empresa,
  ): Promise<Categorias> {
    return await this.categoriasRepository.createCategoria(
      createCategoriaDto,
      empresa,
    );
  }

  async updateCategoria(updateCategoriaDto: UpdateCategoriaDto, id: string) {
    const result = await this.categoriasRepository.update(
      { id },
      {
        nome: updateCategoriaDto.nome,
      },
    );

    if (result.affected > 0) {
      return await this.findCategoriaById(String(id));
    } else {
      throw new NotFoundException('Categoria não encontrada');
    }
  }

  async deleteCategoria(categoriaId: string) {
    try {
      const result = await this.categoriasRepository.delete({
        id: categoriaId,
      });

      if (result.affected === 0) {
        throw new NotFoundException(
          'Não foi encontrada categoria com o ID informado',
        );
      }
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('Há produtos vinculados a categoria');
      } else {
        throw new Error(error.message);
      }
    }
  }
}
