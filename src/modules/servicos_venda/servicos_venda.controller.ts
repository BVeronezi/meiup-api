import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';
import { ServicosVendaService } from './servicos_venda.service';

@Controller('api/v1/servicosVenda')
@ApiTags('Serviços venda')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ServicosVendaController {
  constructor(private servicosVendaService: ServicosVendaService) {}

  @Get()
  @ApiOperation({ summary: 'Busca serviços venda por id' })
  async findServicosVendaById(
    @Query() query: FindServicosVendasQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    try {
      const found = await this.servicosVendaService.findServicosVenda(
        query,
        empresa.id,
      );

      return {
        found,
        message: 'Serviço(s) venda encontrado(s)',
      };
    } catch (error) {
      throw new NotFoundException('Serviço(s) venda não encontrado(s)');
    }
  }
}
