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
import { CategoriasService } from '../categorias/categorias.service';
import { PrecosService } from '../precos/precos.service';
import { ProdutosFornecedoresService } from '../produtos_fornecedores/produtos_fornecedores.service';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { RemoveProdutosFornecedorDto } from './dto/remove-fornecedor-dto';
import { ReturnProdutoDto } from './dto/return-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto-dto';
import { ProdutosService } from './produtos.service';

@Controller('api/v1/produtos')
@ApiTags('Produtos')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ProdutosController {
  constructor(
    private produtosService: ProdutosService,
    private categoriasService: CategoriasService,
    private precosService: PrecosService,
    private produtosFornecedorService: ProdutosFornecedoresService,
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
    @User('usuario') usuario: Usuario,
  ) {
    const found = await this.produtosService.findProdutos(
      query,
      usuario.empresa.id,
    );
    return {
      found,
      message: 'Produtos encontrados',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria produto' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async createProduto(
    @Body() createProdutoDto: CreateProdutoDto,
    @User('usuario') usuario: Usuario,
  ): Promise<ReturnProdutoDto> {
    const idCategoria = String(createProdutoDto.categoria);

    const categoria = await this.categoriasService.findCategoriaById(
      idCategoria,
    );

    const produto = await this.produtosService.createProduto(
      createProdutoDto,
      categoria,
      usuario.empresa,
    );
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
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async updateProduto(
    @Body(ValidationPipe) updateProdutoDto: UpdateProdutoDto,
    @Param('id') id: string,
  ) {
    if (updateProdutoDto.categoria) {
      const idCategoria = String(updateProdutoDto.categoria);

      const categoria = await this.categoriasService.findCategoriaById(
        idCategoria,
      );

      updateProdutoDto.categoria = categoria;
    }

    const produto = await this.produtosService.updateProduto(
      updateProdutoDto,
      id,
    );

    return {
      produto,
      message: 'Produto atualizado com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove produto por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async deleteProduto(
    @Param('id') id: string,
    @User('usuario') usuario: Usuario,
  ) {
    await this.produtosService.deleteProduto(id, usuario.empresa.id);

    return {
      message: 'Produto removido com sucesso',
    };
  }

  @Post('/fornecedor/:produtoId')
  @ApiOperation({ summary: 'Adiciona fornecedor no produto por id' })
  async adicionaFornecedor(
    @Body(ValidationPipe) updateServicoDto: UpdateProdutoDto,
    @User('usuario') usuario: Usuario,
    @Param('produtoId') produtoId: string,
  ) {
    const produto = await this.produtosService.findProdutoById(produtoId);

    const params = {
      produto,
      fornecedor: updateServicoDto.fornecedor,
      empresa: usuario.empresa,
    };

    const produtoFornecedor: any =
      await this.produtosFornecedorService.createProdutoFornecedor(params);

    return {
      produtoFornecedor: produtoFornecedor,
    };
  }

  @Delete('/fornecedor/:produtoId')
  @ApiOperation({ summary: 'Remove fornecedor do produto por id' })
  async removeFornecedor(
    @Param('produtoId') produtoId: string,
    @User('usuario') usuario: Usuario,
    @Body(ValidationPipe)
    removeProdutoFornecedorDto: RemoveProdutosFornecedorDto,
  ) {
    const produto = await this.produtosService.findProdutoById(produtoId);

    await this.produtosFornecedorService.deleteProdutoFornecedor(
      removeProdutoFornecedorDto,
      String(produto.id),
      String(usuario.empresa.id),
    );

    return {
      message: 'Fornecedor removido com sucesso do produto',
    };
  }
}
