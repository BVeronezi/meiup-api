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
import { User } from 'src/decorators/user.decorator';
import { Role } from '../auth/role.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { UserRole } from '../usuario/enum/user-roles.enum';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { FindFornecedoresQueryDto } from './dto/find-fornecedores-query.dto';
import { ReturnFornecedorDto } from './dto/return-fornecedor-dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor-dto';
import { FornecedoresService } from './fornecedores.service';

@Controller('api/v1/fornecedores')
@ApiTags('Fornecedores')
@UseGuards(AuthGuard())
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
    @User('empresa') empresa: Empresa,
  ) {
    const found = await this.fornecedoresService.findFornecedores(
      query,
      empresa.id,
    );
    return {
      found,
      message: 'Fornecedores encontrados',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza fornecedor por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async updateFornecedor(
    @Body(ValidationPipe) updateFornecedorDto: UpdateFornecedorDto,
    @Param('id') id: string,
  ) {
    return this.fornecedoresService.updateFornecedor(updateFornecedorDto, id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria fornecedor' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async createFornecedor(
    @Body() createFornecedorDto: CreateFornecedorDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnFornecedorDto> {
    createFornecedorDto.empresa = empresa;
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
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async deleteFornecedor(@Param('id') id: number) {
    await this.fornecedoresService.deleteForneceor(id);
    return {
      message: 'Fornecedor removido com sucesso',
    };
  }
}
