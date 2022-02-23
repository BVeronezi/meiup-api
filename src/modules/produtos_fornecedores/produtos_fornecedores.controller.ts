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
import { FindProdutosFornecedoresQueryDto } from './dto/find-produtos-fornecedores-dto';
import { ProdutosFornecedoresService } from './produtos_fornecedores.service';

@Controller('api/v1/produtosFornecedor')
@ApiTags('Produtos fornecedor')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ProdutosFornecedoresController {
  constructor(private produtosFornecedorService: ProdutosFornecedoresService) {}

  @Get()
  @ApiOperation({ summary: 'Busca produtos fornecedor por id' })
  async findProdutosServicoById(
    @Query() query: FindProdutosFornecedoresQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    try {
      const found = await this.produtosFornecedorService.findProdutosFornecedor(
        query,
        usuario.empresa.id,
      );

      return {
        found,
        message: 'Produtos fornecedores encontrados',
      };
    } catch (error) {
      throw new NotFoundException('Produtos fornecedores não encontrado');
    }
  }
}
