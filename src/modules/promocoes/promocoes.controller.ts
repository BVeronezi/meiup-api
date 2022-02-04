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
import { UserRole } from '../usuario/enum/user-roles.enum';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { FindPromocoesQueryDto } from './dto/find-promocoes-query-dto';
import { ReturnPromocaoDto } from './dto/return-promocao-dto';
import { UpdatePromocaoDto } from './dto/update-promocao-dto';
import { PromocoesService } from './promocoes.service';

@Controller('api/v1/promocoes')
@ApiTags('Promoções')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class PromocoesController {
  constructor(private promocoesService: PromocoesService) {}

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
    @User('empresa') empresa: Empresa,
  ) {
    const found = await this.promocoesService.findPromocoes(query, empresa.id);
    return {
      found,
      message: 'Promoções encontradas',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria promoção' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async createPromocao(
    @Body() createPromocaoDto: CreatePromocaoDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnPromocaoDto> {
    createPromocaoDto.empresa = empresa;
    const promocao = await this.promocoesService.createPromocao(
      createPromocaoDto,
    );

    return {
      promocao,
      message: 'Promoção cadastrado com sucesso',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza promoção por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async updatePromocao(
    @Body(ValidationPipe) updatePromocaoDto: UpdatePromocaoDto,
    @Param('id') id: string,
  ) {
    return this.promocoesService.updatePromocao(updatePromocaoDto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove promoção por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async deletePromocao(@Param('id') id: number) {
    await this.promocoesService.deletePromocao(id);
    return {
      message: 'Promoção removida com sucesso',
    };
  }
}
