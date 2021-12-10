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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Usuario } from '../usuario/usuario.entity';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda-dto';
import { FindAgendaQueryDto } from './dto/find-agenda-query-dto';
import { ReturnAgendaDto } from './dto/return-agenda-dto';
import { UpdateAgendaDto } from './dto/update-agenda-dto';

@Controller('api/v1/agenda')
@ApiTags('Agenda')
@UseGuards(AuthGuard())
export class AgendaController {
  constructor(private agendaService: AgendaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca agenda por id' })
  async findAgendaById(@Param('id') id): Promise<ReturnAgendaDto> {
    const agenda = await this.agendaService.findAgendaById(id);
    return {
      agenda,
      message: 'Agenda encontrado',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca agenda pelos filtro de titulo, descrição, data ou retorna todos caso não informe os filtros',
  })
  async findAgenda(
    @Query() query: FindAgendaQueryDto,
    @User('id') usuario: Usuario,
  ) {
    const found = await this.agendaService.findAgenda(query, usuario.id);
    return {
      found,
      message: 'Agenda encontrada',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria agenda' })
  async createAgenda(
    @Body() createAgendaDto: CreateAgendaDto,
    @User('id') usuario: Usuario,
  ): Promise<ReturnAgendaDto> {
    createAgendaDto.usuario = usuario;
    const agenda = await this.agendaService.createAgenda(createAgendaDto);

    return {
      agenda,
      message: 'Agenda cadastrado com sucesso',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza agenda por id' })
  async updateAgenda(
    @Body(ValidationPipe) updateAgendaDto: UpdateAgendaDto,
    @Param('id') id: string,
  ) {
    return this.agendaService.updateAgenda(updateAgendaDto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove agenda por id' })
  async deleteAgenda(@Param('id') id: number) {
    await this.agendaService.deleteAgenda(id);
    return {
      message: 'Agenda removida com sucesso',
    };
  }
}
