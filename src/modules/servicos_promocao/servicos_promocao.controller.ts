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
import { FindServicosPromocaoQueryDto } from './dto/find-servicos_promocao-dto';
import { ServicosPromocaoService } from './servicos_promocao.service';

@Controller('api/v1/servicosPromocao')
@ApiTags('Serviços promoção')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ServicosPromocaoController {
  constructor(private servicosPromocaoService: ServicosPromocaoService) {}

  @Get()
  @ApiOperation({ summary: 'Busca serviços promoção por id' })
  async findProdutosServicoById(
    @Query() query: FindServicosPromocaoQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    try {
      const found = await this.servicosPromocaoService.findServicosPromocao(
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
}
