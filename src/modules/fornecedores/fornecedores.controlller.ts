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
import { Role } from '../auth/decorators/role.decorator';
import { User } from '../auth/decorators/user.decorator';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { FindFornecedoresQueryDto } from './dto/find-fornecedores-query.dto';
import { ReturnFornecedorDto } from './dto/return-fornecedor-dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor-dto';
import { FornecedoresService } from './fornecedores.service';

@Controller('api/v1/fornecedores')
@ApiTags('Fornecedores')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class FornecedoresController {
  constructor(private fornecedoresService: FornecedoresService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca fornecedor por id' })
  async findFornecedorById(@Param('id') id): Promise<ReturnFornecedorDto> {
    const fornecedor = await this.fornecedoresService.findFornecedorById(id);
    return {
      fornecedor,
      message: 'Fornecedor encontrado',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca fornecedor pelos filtros de nome, e-mail, cpfCnpj ou retorna todos caso não informe os filtros',
  })
  async findFornecedores(
    @Query() query: FindFornecedoresQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    const found = await this.fornecedoresService.findFornecedores(
      query,
      usuario.empresa.id,
    );
    return {
      found,
      message: 'Fornecedores encontrados',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza fornecedor por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async updateFornecedor(
    @Body(ValidationPipe) updateFornecedorDto: UpdateFornecedorDto,
    @Param('id') id: string,
    @User('usuario') usuario: Usuario,
  ) {
    const fornecedor = this.fornecedoresService.updateFornecedor(
      updateFornecedorDto,
      id,
      usuario,
    );

    return {
      fornecedor,
      message: 'Fornecedor atualizado com sucesso',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria fornecedor' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async createFornecedor(
    @Body() createFornecedorDto: CreateFornecedorDto,
    @User('usuario') usuario: Usuario,
  ): Promise<ReturnFornecedorDto> {
    createFornecedorDto.empresa = usuario.empresa;
    const fornecedor = await this.fornecedoresService.createFornecedor(
      createFornecedorDto,
    );

    return {
      fornecedor,
      message: 'Fornecedor cadastrado com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove o fornecedor por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async deleteFornecedor(@Param('id') id: string) {
    await this.fornecedoresService.deleteFornecedor(id);
    return {
      message: 'Fornecedor removido com sucesso',
    };
  }
}
