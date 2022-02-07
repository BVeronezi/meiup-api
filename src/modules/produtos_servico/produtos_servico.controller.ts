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
import { FindProdutosServicoQueryDto } from './dto/find-produtos-servico-dto';
import { ProdutosServicoService } from './produtos_servico.service';

@Controller('api/v1/produtosServico')
@ApiTags('Produtos serviço')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ProdutosServicoController {
  constructor(private produtosServicoService: ProdutosServicoService) {}

  @Get()
  @ApiOperation({ summary: 'Busca produtos servico por id' })
  async findProdutosServicoById(
    @Query() query: FindProdutosServicoQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    try {
      const found = await this.produtosServicoService.findProdutosServico(
        query,
        usuario.empresa.id,
      );

      return {
        found,
        message: 'Produtos serviços encontrados',
      };
    } catch (error) {
      throw new NotFoundException('Produtos serviços não encontrado');
    }
  }
}
