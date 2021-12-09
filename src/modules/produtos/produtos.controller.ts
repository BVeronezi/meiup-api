import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { CategoriasService } from '../categorias/categorias.service';
import { Empresa } from '../empresa/empresa.entity';
import { PrecosService } from '../precos/precos.service';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { ReturnProdutoDto } from './dto/return-produto.dto';
import { ProdutosService } from './produtos.service';

@Controller('api/v1/produtos')
@ApiTags('Produtos')
@UseGuards(AuthGuard())
export class ProdutosController {
  constructor(
    private produtosService: ProdutosService,
    private categoriasService: CategoriasService,
    private precosService: PrecosService,
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

  @Post()
  @ApiOperation({ summary: 'Cria produto' })
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
    const produto = await this.produtosService.createProduto(createProdutoDto);

    if (Object.keys(createProdutoDto.precos).length !== 0) {
      const precos = await this.precosService.createPrecos(
        createProdutoDto.precos,
      );

      produto.precos = precos;

      produto.save();
    }

    return {
      produto,
      message: 'Produto cadastrado com sucesso',
    };
  }
}
