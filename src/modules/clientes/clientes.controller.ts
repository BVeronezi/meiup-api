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
import { Empresa } from '../empresa/empresa.entity';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { FindClientesQueryDto } from './dto/find-clientes-query.dto';
import { ReturnClienteDto } from './dto/return-cliente-dto';
import { UpdateClienteDto } from './dto/update-cliente-dto';

@Controller('api/v1/clientes')
@ApiTags('Clientes')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca cliente por id' })
  async findClienteById(@Param('id') id): Promise<ReturnClienteDto> {
    const cliente = await this.clientesService.findClienteById(id);
    return {
      cliente,
      message: 'Cliente encontrado',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca cliente pelos filtros de nome, e-mail ou retorna todos caso não informe os filtros',
  })
  async findClientes(
    @Query() query: FindClientesQueryDto,
    @User('empresa') empresa: Empresa,
  ) {
    const found = await this.clientesService.findClientes(query, empresa.id);
    return {
      found,
      message: 'Clientes encontrados',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza cliente por id' })
  async updateCliente(
    @Body(ValidationPipe) updateClienteDto: UpdateClienteDto,
    @Param('id') id: string,
  ) {
    return this.clientesService.updateCliente(updateClienteDto, id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria cliente' })
  async createCliente(
    @Body() createClienteDto: CreateClienteDto,
    @User('empresa') empresa: Empresa,
  ): Promise<ReturnClienteDto> {
    createClienteDto.empresa = empresa;
    const cliente = await this.clientesService.createCliente(createClienteDto);

    return {
      cliente,
      message: 'Cliente cadastrado com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove o cliente por id' })
  async deleteCliente(@Param('id') id: number) {
    await this.clientesService.deleteCliente(id);
    return {
      message: 'Cliente removido com sucesso',
    };
  }
}
