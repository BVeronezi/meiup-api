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
import { CategoriasService } from '../categorias/categorias.service';
import { Empresa } from '../empresa/empresa.entity';
import { FornecedoresService } from '../fornecedores/fornecedores.service';
import { PrecosService } from '../precos/precos.service';
import { UserRole } from '../usuario/enum/user-roles.enum';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { FornecedorProdutoDto } from './dto/fornecedor-produto-dto';
import { ReturnProdutoDto } from './dto/return-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto-dto';
import { ProdutosService } from './produtos.service';

@Controller('api/v1/produtos')
@ApiTags('Produtos')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class ProdutosController {
  constructor(
    private produtosService: ProdutosService,
    private categoriasService: CategoriasService,
    private precosService: PrecosService,
    private fornecedoresService: FornecedoresService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por id' })
  async findProdutoById(@Param('id') id): Promise<ReturnProdutoDto> {
    const produto = await this.produtosService.findProdutoById(id);
    return {
      produto,
      message: 'Produto encontrado',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca produtos pelos filtro de descrição ou retorna todos caso não informe a descrição',
  })
  async findProdutos(
    @Query() query: FindProdutosQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    const found = await this.produtosService.findProdutos(query, empresa.id);
    return {
      found,
      message: 'Produtos encontrados',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria produto' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async createProduto(
    @Body() createProdutoDto: CreateProdutoDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnProdutoDto> {
    const idCategoria = Number(createProdutoDto.categoria);

    const categoria = await this.categoriasService.findCategoriaById(
      idCategoria,
    );

    if (!categoria) {
      throw new Error('Categoria não cadastrada');
    }

    createProdutoDto.empresa = empresa;
    if (createProdutoDto.fornecedoresProduto.length > 0) {
      const fornecedoresProduto = [];

      for (const idFornecedor of createProdutoDto.fornecedoresProduto) {
        const fornecedor = await this.fornecedoresService.findFornecedorById(
          Number(idFornecedor),
        );

        fornecedoresProduto.push(fornecedor);
      }

      createProdutoDto.fornecedoresProduto = fornecedoresProduto;
    }

    const produto = await this.produtosService.createProduto(createProdutoDto);
    if (Object.keys(createProdutoDto.precos).length !== 0) {
      const params = Object.assign(createProdutoDto.precos, {
        produto: produto.id,
      });

      const precos = await this.precosService.updateOrCreatePrecos(
        params,
        produto.precos?.id,
      );

      produto.precos = precos;

      produto.save();
    }

    return {
      produto,
      message: 'Produto cadastrado com sucesso',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza produto por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async updateProduto(
    @Body(ValidationPipe) updateProdutoDto: UpdateProdutoDto,
    @Param('id') id: string,
  ) {
    const idCategoria = Number(updateProdutoDto.categoria);

    const categoria = await this.categoriasService.findCategoriaById(
      idCategoria,
    );

    if (!categoria) {
      throw new Error('Categoria não cadastrada');
    }

    return this.produtosService.updateProduto(updateProdutoDto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove produto por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async deleteProduto(@Param('id') id: number) {
    await this.produtosService.deleteProduto(id);
    return {
      message: 'Produto removido com sucesso',
    };
  }

  @Delete('/fornecedor/:id')
  @ApiOperation({ summary: 'Remove fornecedor do produto por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async deleteFornecedorProduto(
    @Param('id') id: number,
    @Body(ValidationPipe) fornecedorProdutoDto: FornecedorProdutoDto,
  ) {
    await this.produtosService.deleteFornecedorProduto(
      fornecedorProdutoDto,
      id,
    );
    return {
      message: 'Fornecedor removido com sucesso',
    };
  }
}
