import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosVendaService } from '../produtos_venda/produtos_venda.service';
import { ServicosVendaService } from '../servicos_venda/servicos_venda.service';
import { Usuario } from '../usuario/usuario.entity';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { RemoveProdutoVendaDto } from './dto/remove-produto-venda-dto';
import { RemoveServicoVendaDto } from './dto/remove-servico-venda-dto';
import { ReturnVendasDto } from './dto/return-venda-dto';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { VendasService } from './vendas.service';

@Controller('api/v1/vendas')
@ApiTags('Vendas')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class VendasController {
  constructor(
    private vendasService: VendasService,
    private produtosVendaService: ProdutosVendaService,
    private servicosVendaService: ServicosVendaService,
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

  @Patch('/finaliza/:id')
  @ApiOperation({ summary: 'Finaliza venda por id' })
  async finalizaVenda(@Param('id') id): Promise<ReturnVendasDto> {
    const venda = await this.vendasService.finalizaVenda(id);
    return {
      venda,
      message: 'Venda finalizada',
    };
  }

  @Patch('/cancela/:id')
  @ApiOperation({ summary: 'Cancela venda por id' })
  async cancelaVenda(
    @Param('id') id,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnVendasDto> {
    const venda = await this.vendasService.cancelaVenda(id, empresa);

    return {
      venda,
      message: 'Venda cancelada',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza o cliente e valores da venda por id' })
  async updateVenda(
    @Body(ValidationPipe) updateVendaDto: UpdateVendaDto,
    @Param('id') id: string,
  ) {
    return this.vendasService.updateVenda(updateVendaDto, id);
  }

  @Post('/produtoVenda/:vendaId')
  @ApiOperation({ summary: 'Adiciona produto na venda por id' })
  async adicionaProdutoVenda(
    @Body(ValidationPipe) updateVendaDto: UpdateVendaDto,
    @User('empresa') empresa: Empresa,
    @Param('vendaId') vendaId: number,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    const produtoVenda: any = await this.vendasService.adicionaProdutoVenda(
      updateVendaDto,
      venda,
      empresa,
    );

    return {
      produtoVenda: produtoVenda,
    };
  }

  @Post('/servicosVenda/:vendaId')
  @ApiOperation({ summary: 'Adiciona serviço na venda por id' })
  async adicionaProdutoServico(
    @Body(ValidationPipe) updateVendaDto: UpdateVendaDto,
    @User('empresa') empresa: Empresa,
    @Param('vendaId') vendaId: number,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    await this.vendasService.adicionaServicoVenda(
      updateVendaDto,
      venda,
      empresa,
    );

    return {
      venda,
      message: 'Serviço adicionado com sucesso na venda',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria venda' })
  async createVenda(
    @Body() createVendaDto: CreateVendaDto,
    @User('empresa') empresa: Empresa,
    @User('id') usuario: Usuario,
  ): Promise<ReturnVendasDto> {
    createVendaDto.empresa = empresa;
    createVendaDto.usuario = usuario;

    const venda = await this.vendasService.createVenda(createVendaDto);

    if (createVendaDto.servicos?.length > 0) {
      await this.vendasService.adicionaServicoVenda(
        createVendaDto.servicos,
        venda,
        empresa,
      );
    }

    if (createVendaDto.produtos?.length > 0) {
      await this.vendasService.adicionaProdutoVenda(
        createVendaDto.produtos,
        venda,
        empresa,
      );
    }

    return {
      venda,
      message: 'Venda cadastrada com sucesso',
    };
  }

  @Delete('/produtoVenda/:vendaId')
  @ApiOperation({ summary: 'Remove produto da venda por id' })
  async removeProdutoVenda(
    @Param('vendaId') vendaId: number,
    @Body(ValidationPipe) removeProdutoVendaDto: RemoveProdutoVendaDto,
  ) {
    await this.produtosVendaService.deleteProdutoVenda(
      removeProdutoVendaDto,
      vendaId,
    );

    return {
      message: 'Produto removido com sucesso da venda',
    };
  }

  @Delete('/servicosVenda/:vendaId')
  @ApiOperation({ summary: 'Remove servico da venda por id' })
  async removeServicoVenda(
    @Body(ValidationPipe) removeServicoVendaDto: RemoveServicoVendaDto,
    @Param('vendaId') vendaId: number,
    @User('empresa') empresa: Empresa,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    await this.servicosVendaService.deleteServicoVenda(
      removeServicoVendaDto,
      Number(venda.id),
      Number(empresa.id),
    );

    return {
      message: 'Servico(s) removido(s) com sucesso da venda',
    };
  }
}
