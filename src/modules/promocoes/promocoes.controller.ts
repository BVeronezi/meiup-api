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
import { Role } from '../auth/decorators/role.decorator';
import { User } from '../auth/decorators/user.decorator';
import { ProdutosPromocaoService } from '../produtos_promocao/produtos_promocao.service';
import { ServicosPromocaoService } from '../servicos_promocao/servicos_promocao.service';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { FindPromocoesQueryDto } from './dto/find-promocoes-query-dto';
import { RemoveProdutosPromocaoDto } from './dto/remove-produto-promocao-dto';
import { RemoveServicosPromocaoDto } from './dto/remove-servico-promocao-dto';
import { ReturnPromocaoDto } from './dto/return-promocao-dto';
import { UpdatePromocaoDto } from './dto/update-promocao-dto';
import { PromocoesService } from './promocoes.service';

@Controller('api/v1/promocoes')
@ApiTags('Promoções')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class PromocoesController {
  constructor(
    private promocoesService: PromocoesService,
    private produtoPromocaoService: ProdutosPromocaoService,
    private servicoPromocaoService: ServicosPromocaoService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca promocao por id' })
  async findPromocaoById(@Param('id') id): Promise<ReturnPromocaoDto> {
    const promocao = await this.promocoesService.findPromocaoById(id);
    return {
      promocao,
      message: 'Promoção encontrado',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca produtos pelos filtro de descrição ou retorna todos caso não informe a descrição',
  })
  async findPromocoes(
    @Query() query: FindPromocoesQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    const found = await this.promocoesService.findPromocoes(
      query,
      usuario.empresa.id,
    );
    return {
      found,
      message: 'Promoções encontradas',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria promoção' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async createPromocao(
    @Body() createPromocaoDto: CreatePromocaoDto,
    @User('usuario') usuario: Usuario,
  ): Promise<ReturnPromocaoDto> {
    const promocao = await this.promocoesService.createPromocao(
      createPromocaoDto,
      usuario.empresa,
    );

    return {
      promocao,
      message: 'Promoção cadastrada com sucesso',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza promoção por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async updatePromocao(
    @Body(ValidationPipe) updatePromocaoDto: UpdatePromocaoDto,
    @Param('id') id: string,
  ) {
    const promocao = this.promocoesService.updatePromocao(
      updatePromocaoDto,
      id,
    );

    return {
      promocao,
      message: 'Promoção atualizada com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove promoção por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async deletePromocao(
    @Param('id') id: string,
    @User('usuario') usuario: Usuario,
  ) {
    await this.promocoesService.deletePromocao(id, usuario.empresa.id);
    return {
      message: 'Promoção removida com sucesso',
    };
  }

  @Post('/produto/:promocaoId')
  @ApiOperation({ summary: 'Adiciona produto na promoção por id' })
  async adicionaProdutoPromocao(
    @Body(ValidationPipe) updatePromocaoDto: UpdatePromocaoDto,
    @User('usuario') usuario: Usuario,
    @Param('promocaoId') promocaoId: string,
  ) {
    const promocao = await this.promocoesService.findPromocaoById(promocaoId);

    const produtoPromoao: any =
      await this.promocoesService.adicionaProdutoPromocao(
        updatePromocaoDto,
        promocao,
        usuario.empresa,
      );

    return {
      produtoPromoao: produtoPromoao,
    };
  }

  @Delete('/produto/:promocaoId')
  @ApiOperation({ summary: 'Remove produto da promoção por id' })
  async removeProdutoPromocao(
    @Param('promocaoId') promocaoId: string,
    @User('usuario') usuario: Usuario,
    @Body(ValidationPipe) removeProdutoPromocaoDto: RemoveProdutosPromocaoDto,
  ) {
    const promocao = await this.promocoesService.findPromocaoById(promocaoId);

    await this.produtoPromocaoService.deleteProdutoPromocao(
      removeProdutoPromocaoDto,
      String(promocao.id),
      String(usuario.empresa.id),
    );

    return {
      message: 'Produto removido com sucesso da promoção',
    };
  }

  @Post('/servico/:promocaoId')
  @ApiOperation({ summary: 'Adiciona serviço na promoção por id' })
  async adicionaServixoPromocao(
    @Body(ValidationPipe) updatePromocaoDto: UpdatePromocaoDto,
    @User('usuario') usuario: Usuario,
    @Param('promocaoId') promocaoId: string,
  ) {
    const promocao = await this.promocoesService.findPromocaoById(promocaoId);

    const servicoPromocao: any =
      await this.promocoesService.adicionaServicoPromocao(
        updatePromocaoDto,
        promocao,
        usuario.empresa,
      );

    return {
      servicoPromocao: servicoPromocao,
    };
  }

  @Delete('/servico/:promocaoId')
  @ApiOperation({ summary: 'Remove serviço da promoção por id' })
  async removeServicoPromocao(
    @Param('promocaoId') promocaoId: string,
    @User('usuario') usuario: Usuario,
    @Body(ValidationPipe) removeServicoPromocaoDto: RemoveServicosPromocaoDto,
  ) {
    const promocao = await this.promocoesService.findPromocaoById(promocaoId);

    await this.servicoPromocaoService.deleteServicoPromocao(
      removeServicoPromocaoDto,
      String(promocao.id),
      String(usuario.empresa.id),
    );

    return {
      message: 'Serviço removido com sucesso da promoção',
    };
  }
}
