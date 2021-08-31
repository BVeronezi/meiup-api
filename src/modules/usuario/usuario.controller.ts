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
import { GetUser } from '../auth/get-user.decorator';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindUsuariosQueryDto } from './dto/find-usuarios-query.dto';
import { ReturnUsuarioDto } from './dto/return-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UserRole } from './enum/user-roles.enum';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('api/v1/usuario')
@ApiTags('Usuários')
@UseGuards(AuthGuard(), RolesGuard)
export class UsuariosController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria usuário administrador' })
  @Role(UserRole.ADMIN)
  async createAdminUser(
    @Body() createUserDto: CreateUsuarioDto,
  ): Promise<ReturnUsuarioDto> {
    const user = await this.usuarioService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por id' })
  @Role(UserRole.ADMIN)
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
    @GetUser() user: Usuario,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.usuarioService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove o usuário por id' })
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usuarioService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Busca usuário pelos filtros de nome ou  e-mail' })
  @Role(UserRole.ADMIN)
  async findUsers(@Query() query: FindUsuariosQueryDto) {
    const found = await this.usuarioService.findUsers(query);
    return {
      found,
      message: 'Usuários encontrados',
    };
  }
}
