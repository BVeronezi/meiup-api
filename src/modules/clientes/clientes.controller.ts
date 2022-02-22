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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { FindClientesQueryDto } from './dto/find-clientes-query.dto';
import { ReturnClienteDto } from './dto/return-cliente-dto';
import { UpdateClienteDto } from './dto/update-cliente-dto';
import { isEmpty } from 'lodash';
import { Usuario } from '../usuario/usuario.entity';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../auth/decorators/user.decorator';
@Controller('api/v1/clientes')
@ApiTags('Clientes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @User('usuario') usuario: Usuario,
  ) {
    const found = await this.clientesService.findClientes(
      query,
      usuario.empresa.id,
    );
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
    @User('usuario') usuario: Usuario,
  ) {
    const cliente = this.clientesService.updateCliente(
      updateClienteDto,
      id,
      usuario,
    );

    return {
      cliente,
      message: 'Cliente atualizado com sucesso',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria cliente' })
  async createCliente(
    @Body() createClienteDto: CreateClienteDto,
    @User('usuario') usuario: Usuario,
  ): Promise<ReturnClienteDto> {
    const cliente = await this.clientesService.createCliente(
      createClienteDto,
      usuario.empresa,
    );

    if (!isEmpty(createClienteDto.endereco)) {
      await this.clientesService.endereco(createClienteDto, usuario, cliente);
    }

    return {
      cliente,
      message: 'Cliente cadastrado com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove o cliente por id' })
  async deleteCliente(@Param('id') id: string) {
    await this.clientesService.deleteCliente(id);
    return {
      message: 'Cliente removido com sucesso',
    };
  }
}
