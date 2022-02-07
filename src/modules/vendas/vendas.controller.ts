import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
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
@UseGuards(AuthGuard('jwt'))
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
    @User('usuario') usuario: Usuario,
  ) {
    const found = await this.vendasService.findVendas(
      query,
      usuario.empresa.id,
    );

    return {
      found,
      message: 'Vendas encontradas',
    };
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
    @User('usuario') usuario: Usuario,
  ): Promise<ReturnVendasDto> {
    const venda = await this.vendasService.cancelaVenda(id, usuario.empresa);

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
    @User('usuario') usuario: Usuario,
    @Param('vendaId') vendaId: number,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    const response: any = await this.vendasService.adicionaProdutoVenda(
      updateVendaDto,
      venda,
      usuario.empresa,
    );

    return {
      produtoVenda: response.produtoVenda,
      valorVenda: response.valorTotal,
      message: 'Produto adicionado com sucesso na venda',
    };
  }

  @Post('/servicosVenda/:vendaId')
  @ApiOperation({ summary: 'Adiciona serviço na venda por id' })
  async adicionaServicoVenda(
    @Body(ValidationPipe) updateVendaDto: UpdateVendaDto,
    @User('usuario') usuario: Usuario,
    @Param('vendaId') vendaId: number,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    const response = await this.vendasService.adicionaServicoVenda(
      updateVendaDto,
      venda,
      usuario.empresa,
    );

    return {
      servicoVenda: response.servicoVenda,
      valorVenda: response.valorTotal,
      message: 'Serviço adicionado com sucesso na venda',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria venda' })
  async createVenda(
    @Body() createVendaDto: CreateVendaDto,
    @User('usuario') usuario: Usuario,
  ): Promise<ReturnVendasDto> {
    createVendaDto.empresa = usuario.empresa;
    createVendaDto.usuario = usuario;

    const venda = await this.vendasService.createVenda(createVendaDto);

    if (createVendaDto.servicos?.length > 0) {
      await this.vendasService.adicionaServicoVenda(
        createVendaDto.servicos,
        venda,
        usuario.empresa,
      );
    }

    if (createVendaDto.produtos?.length > 0) {
      await this.vendasService.adicionaProdutoVenda(
        createVendaDto.produtos,
        venda,
        usuario.empresa,
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
    @User('usuario') usuario: Usuario,
    @Body(ValidationPipe) removeProdutoVendaDto: RemoveProdutoVendaDto,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    await this.produtosVendaService.deleteProdutoVenda(
      removeProdutoVendaDto,
      Number(venda.id),
    );

    const valorVenda = await this.vendasService.calculaTotalVenda(
      Number(venda.id),
      usuario.empresa.id,
    );

    venda.valorTotal = valorVenda;
    await venda.save();

    return {
      valorVenda: valorVenda,
      message: 'Produto removido com sucesso da venda',
    };
  }

  @Delete('/servicosVenda/:vendaId')
  @ApiOperation({ summary: 'Remove servico da venda por id' })
  async removeServicoVenda(
    @Body(ValidationPipe) removeServicoVendaDto: RemoveServicoVendaDto,
    @Param('vendaId') vendaId: number,
    @User('usuario') usuario: Usuario,
  ) {
    const venda = await this.vendasService.findVendaById(vendaId);

    await this.servicosVendaService.deleteServicoVenda(
      removeServicoVendaDto,
      Number(venda.id),
      Number(usuario.empresa.id),
    );

    const valorVenda = await this.vendasService.calculaTotalVenda(
      Number(venda.id),
      usuario.empresa.id,
    );

    venda.valorTotal = valorVenda;
    await venda.save();

    return {
      valorVenda: valorVenda,
      message: 'Serviço removido com sucesso da venda',
    };
  }
}
