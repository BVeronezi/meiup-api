import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutosVendaService } from './produtos_venda.service';

@Controller('api/v1/produtosVenda')
@ApiTags('Produtos venda')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class ProdutosVendaController {
  constructor(private produtosVendaService: ProdutosVendaService) {}

  @Get()
  @ApiOperation({ summary: 'Busca produtos venda por id' })
  async findProdutosVendaById(
    @Query() query: FindProdutosVendasQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    try {
      const found = await this.produtosVendaService.findProdutosVenda(
        query,
        empresa.id,
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
