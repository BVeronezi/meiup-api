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
import { User } from 'src/decorators/user.decorator';
import { Role } from '../auth/role.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { UserRole } from '../usuario/enum/user-roles.enum';
import { CreateServicosDto } from './dto/create-servicos-dto';
import { FindServicosQueryDto } from './dto/find-servicos-query-dto';
import { RemoveProdutosServicoDto } from './dto/remove-produto-servico-dto';
import { ReturnServicosDto } from './dto/return-servicos-dto';
import { UpdateServicosDto } from './dto/update-servicos-dto';
import { ServicosService } from './servicos.service';

@Controller('api/v1/servicos')
@ApiTags('Serviços')
@UseGuards(AuthGuard())
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

    if (createServicosDto.produtos?.length > 0) {
      await this.servicosService.adicionaProdutoServico(
        createServicosDto.produtos,
        servico,
        empresa,
      );
    }

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
    return this.servicosService.updateServico(updateServicoDto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove serviço por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async deleteServico(@Param('id') id: number) {
    await this.servicosService.deleteServico(id);
    return {
      message: 'Serviço removido com sucesso',
    };
  }

  @Delete('/produtosServico/:servicoId')
  @ApiOperation({ summary: 'Remove produto do servico por id' })
  async removeProdutoServico(
    @Param('servicoId') servicoId: number,
    @User('empresa') empresa: Empresa,
    @Body(ValidationPipe) removeProdutoServicoDto: RemoveProdutosServicoDto,
  ) {
    if (removeProdutoServicoDto.produtos.length > 0) {
      const servico = await this.servicosService.findServicoById(servicoId);

      await this.produtosServicoService.deleteProdutoServico(
        removeProdutoServicoDto.produtos,
        Number(servico.id),
        Number(empresa.id),
      );

      return {
        message: 'Produto(s) removido(s) com sucesso do serviço',
      };
    }
  }
}
