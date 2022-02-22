import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { Usuario } from '../usuario/usuario.entity';
import { FindProdutosPromocaoQueryDto } from './dto/find-produtos-promocao-dto';
import { ProdutosPromocaoService } from './produtos_promocao.service';

@Controller('api/v1/produtosPromocao')
@ApiTags('Produtos promoção')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ProdutosPromocaoController {
  constructor(private produtosPromocaoService: ProdutosPromocaoService) {}

  @Get()
  @ApiOperation({ summary: 'Busca produtos promoção por id' })
  async findProdutosPromocaoById(
    @Query() query: FindProdutosPromocaoQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    try {
      const found = await this.produtosPromocaoService.findProdutosPromocao(
        query,
        usuario.empresa.id,
      );

      return {
        found,
        message: 'Produtos promoção encontrados',
      };
    } catch (error) {
      throw new NotFoundException('Produtos promoção não encontrado');
    }
  }

  @Get('/produto')
  @ApiOperation({ summary: 'Busca promoção do produto' })
  async findProdutoPromocaoAtiva(
    @Query() query: FindProdutosPromocaoQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    try {
      const promocao =
        await this.produtosPromocaoService.findProdutoPromocaoAtiva(
          query.produtoId,
          usuario.empresa.id,
        );

      return promocao;
    } catch (error) {
      throw new NotFoundException('Produto promoção não encontrado');
    }
  }
}
