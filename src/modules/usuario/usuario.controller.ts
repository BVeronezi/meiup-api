import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  ValidationPipe,
  ForbiddenException,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindUsuariosQueryDto } from './dto/find-usuarios-query.dto';
import { ReturnUsuarioDto } from './dto/return-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from './enum/user-roles.enum';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { isEmpty, values } from 'lodash';
import { User } from '../auth/decorators/user.decorator';
import { Role } from '../auth/decorators/role.decorator';
@Controller('api/v1/usuario')
@ApiTags('Usuários')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsuariosController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria usuário' })
  async createUser(
    @Body() createUserDto: CreateUsuarioDto,
  ): Promise<ReturnUsuarioDto> {
    const user = await this.usuarioService.createUser(createUserDto);

    if (!values(createUserDto.endereco).every(isEmpty)) {
      const endereco = await this.usuarioService.endereco(createUserDto, user);

      user.endereco = endereco;
      await user.save();
    }

    return {
      user,
      message: 'Usuário cadastrado com sucesso',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por id' })
  async findUserById(@Param('id') id): Promise<ReturnUsuarioDto> {
    const user = await this.usuarioService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza usuário por id' })
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUsuarioDto,
    @User() user: Usuario,
    @Param('id') id: string,
  ) {
    if (user.tipo == TipoUsuario.FUNCIONARIO && user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.usuarioService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove o usuário por id' })
  @Role(TipoUsuario.MEI)
  async deleteUser(@Param('id') id: string) {
    await this.usuarioService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Busca usuário pelos filtros de nome, e-mail ou retorna todos caso não informe os filtros',
  })
  async findUsers(
    @Query() query: FindUsuariosQueryDto,
    @User('usuario') usuario: Usuario,
  ) {
    const found = await this.usuarioService.findUsers(
      query,
      usuario.empresa.id,
    );
    return {
      found,
      message: 'Usuários encontrados',
    };
  }
}
