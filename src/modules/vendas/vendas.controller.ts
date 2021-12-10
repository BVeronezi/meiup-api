import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { ServicosService } from '../servicos/servicos.service';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { ReturnVendasDto } from './dto/return-venda-dto';
import { VendasService } from './vendas.service';

@Controller('api/v1/vendas')
@ApiTags('Vendas')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class VendasController {
  constructor(
    private vendasService: VendasService,
    private servicoService: ServicosService,
    private produtosService: ProdutosService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca venda por id' })
  async findVendaById(@Param('id') id): Promise<ReturnVendasDto> {
    const venda = await this.vendasService.findVendaById(id);
    return {
      venda,
      message: 'Venda encontrada',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca venda pelos filtro de cliente ou data da venda ou retorna todas caso não informe os filtros',
  })
  async findVendas(
    @Query() query: FindVendasQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    try {
      const found = await this.vendasService.findVendas(query, empresa.id);

      return {
        found,
        message: 'Vendas encontradas',
      };
    } catch (error) {
      throw new NotFoundException('Venda não encontrada');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Cria venda' })
  async createVenda(
    @Body() createVendaDto: CreateVendaDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnVendasDto> {
    createVendaDto.empresa = empresa;

    if (createVendaDto.servicos?.length > 0) {
      const servicosVenda = [];
      for (const servicoId of createVendaDto.servicos) {
        const servico = await this.servicoService.findServicoById(
          Number(servicoId),
        );

        servicosVenda.push(servico);
      }

      createVendaDto.servicos = servicosVenda;
    }

    if (createVendaDto.produtos?.length > 0) {
      const produtosVenda = [];
      for (const produtoId of createVendaDto.produtos) {
        const produto = await this.produtosService.findProdutoById(
          Number(produtoId),
        );

        produtosVenda.push(produto);
      }

      createVendaDto.produtos = produtosVenda;
    }

    const venda = await this.vendasService.createVenda(createVendaDto);

    return {
      venda,
      message: 'Venda cadastrada com sucesso',
    };
  }
}
