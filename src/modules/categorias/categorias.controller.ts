import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria-dto';
import { ReturnCategoriaDto } from './dto/return-categoria-dto';
import { UpdateCategoriaDto } from './dto/update-categoria-dto';

@Controller('api/v1/categorias')
@ApiTags('Categorias')
@UseGuards(AuthGuard())
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca categoria por id' })
  async findCategoriaById(@Param('id') id): Promise<ReturnCategoriaDto> {
    const categoria = await this.categoriasService.findCategoriaById(id);
    return {
      categoria,
      message: 'Categoria encontrada',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria categoria' })
  async createCategoria(
    @Body() createCategoriaDto: CreateCategoriaDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnCategoriaDto> {
    createCategoriaDto.empresa = empresa;
    const categoria = await this.categoriasService.createCategoria(
      createCategoriaDto,
    );
    return {
      categoria,
      message: 'Categoria cadastrada com sucesso',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza categoria por id' })
  async updateCategoria(
    @Body(ValidationPipe) updateCategoriaDto: UpdateCategoriaDto,
    @Param('id') id: number,
  ) {
    return this.categoriasService.updateCategoria(updateCategoriaDto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove categoria por id' })
  async deleteCategoria(@Param('id') id: number) {
    await this.categoriasService.deleteCategoria(id);
    return {
      message: 'Categoria removida com sucesso',
    };
  }
}