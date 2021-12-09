import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Empresa } from '../empresa/empresa.entity';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { ReturnClienteDto } from './dto/return-cliente-dto';

@Controller('api/v1/clientes')
@ApiTags('Clientes')
@UseGuards(AuthGuard())
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca cliente por id' })
  async findProdutoById(@Param('id') id): Promise<ReturnClienteDto> {
    const cliente = await this.clientesService.findClienteById(id);
    return {
      cliente,
      message: 'Cliente encontrado',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria cliente' })
  async createProduto(
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
}
