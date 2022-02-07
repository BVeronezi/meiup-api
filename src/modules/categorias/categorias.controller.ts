import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import { Role } from '../auth/role.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria-dto';
import { FindCategoriasQueryDto } from './dto/find-categorias-query-dto';
import { ReturnCategoriaDto } from './dto/return-categoria-dto';
import { UpdateCategoriaDto } from './dto/update-categoria-dto';

@Controller('api/v1/categorias')
@ApiTags('Categorias')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
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

  @Get()
  @ApiOperation({
    summary:
      'Busca categorias pelos filtro de nome ou retorna todas caso não informe o filtro',
  })
  async findCategorias(
    @Query() query: FindCategoriasQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    const found = await this.categoriasService.findCategorias(
      query,
      empresa.id,
    );
    return {
      found,
      message: 'Categorias encontradas',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria categoria' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
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
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async updateCategoria(
    @Body(ValidationPipe) updateCategoriaDto: UpdateCategoriaDto,
    @Param('id') id: string,
  ) {
    const categoria = this.categoriasService.updateCategoria(
      updateCategoriaDto,
      id,
    );

    return {
      categoria,
      message: 'Categoria atualizada com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove categoria por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async deleteCategoria(@Param('id') id: string) {
    await this.categoriasService.deleteCategoria(id);
    return {
      message: 'Categoria removida com sucesso',
    };
  }
}
