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
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutosVendaService } from './produtos_venda.service';

@Controller('api/v1/produtosVenda')
@ApiTags('Produtos venda')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ProdutosVendaController {
  constructor(private produtosVendaService: ProdutosVendaService) {}

  @Get()
  @ApiOperation({ summary: 'Busca produtos venda por id' })
  async findProdutosVendaById(
    @Query() query: FindProdutosVendasQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    try {
      const found = await this.produtosVendaService.findProdutosVenda(
        query,
        usuario.empresa.id,
      );

      return {
        found,
        message: 'Produto(s) venda encontrado(s)',
      };
    } catch (error) {
      throw new NotFoundException('Produto(s) venda não encontrado(s)');
    }
  }
}
