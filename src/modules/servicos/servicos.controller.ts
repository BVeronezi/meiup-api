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
import { User } from '../../decorators/user.decorator';
import { Role } from '../auth/role.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { CreateServicosDto } from './dto/create-servicos-dto';
import { FindServicosQueryDto } from './dto/find-servicos-query-dto';
import { RemoveProdutosServicoDto } from './dto/remove-produto-servico-dto';
import { ReturnServicosDto } from './dto/return-servicos-dto';
import { UpdateServicosDto } from './dto/update-servicos-dto';
import { ServicosService } from './servicos.service';

@Controller('api/v1/servicos')
@ApiTags('Serviços')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ServicosController {
  constructor(
    private servicosService: ServicosService,
    private produtosServicoService: ProdutosServicoService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por id' })
  async findServicoById(@Param('id') id): Promise<ReturnServicosDto> {
    const servico = await this.servicosService.findServicoById(id);
    return {
      servico,
      message: 'Serviço encontrado',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca serviço pelos filtro de nome ou retorna todos caso não informe a nome',
  })
  async findServicos(
    @Query() query: FindServicosQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    const found = await this.servicosService.findServicos(query, empresa.id);
    return {
      found,
      message: 'Serviços encontrados',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria serviço' })
  async createServico(
    @Body() createServicosDto: CreateServicosDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnServicosDto> {
    createServicosDto.empresa = empresa;
    const servico = await this.servicosService.createServico(createServicosDto);

    return {
      servico,
      message: 'Serviço cadastrado com sucesso',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza serviço por id' })
  async updateServico(
    @Body(ValidationPipe) updateServicoDto: UpdateServicosDto,
    @Param('id') id: string,
  ) {
    const servico = this.servicosService.updateServico(updateServicoDto, id);

    return {
      servico,
      message: 'Serviço atualizado com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove serviço por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async deleteServico(
    @Param('id') id: string,
    @User('empresa') empresa: Empresa,
  ) {
    await this.servicosService.deleteServico(id, Number(empresa.id));
    return {
      message: 'Serviço removido com sucesso',
    };
  }

  @Post('/produtosServico/:servicoId')
  @ApiOperation({ summary: 'Adiciona produto no serviço por id' })
  async adicionaProdutoServico(
    @Body(ValidationPipe) updateServicoDto: UpdateServicosDto,
    @User('empresa') empresa: Empresa,
    @Param('servicoId') servicoId: string,
  ) {
    const servico = await this.servicosService.findServicoById(servicoId);

    const produtoServico: any =
      await this.servicosService.adicionaProdutoServico(
        updateServicoDto,
        servico,
        empresa,
      );

    return {
      produtoServico: produtoServico,
    };
  }

  @Delete('/produtosServico/:servicoId')
  @ApiOperation({ summary: 'Remove produto do servico por id' })
  async removeProdutoServico(
    @Param('servicoId') servicoId: string,
    @User('empresa') empresa: Empresa,
    @Body(ValidationPipe) removeProdutoServicoDto: RemoveProdutosServicoDto,
  ) {
    const servico = await this.servicosService.findServicoById(servicoId);

    await this.produtosServicoService.deleteProdutoServico(
      removeProdutoServicoDto,
      String(servico.id),
      String(empresa.id),
    );

    return {
      message: 'Produto removido com sucesso do serviço',
    };
  }
}
