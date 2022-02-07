import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { EmpresaService } from './empresa.service';
import { ReturnEmpresaDto } from './dto/return-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Role } from '../auth/decorators/role.decorator';
import { User } from '../auth/decorators/user.decorator';
@Controller('api/v1/empresa')
@ApiTags('Empresa')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access-token')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca empresa por id' })
  @Role(TipoUsuario.MEI)
  async findCompanyById(@Param('id') id): Promise<ReturnEmpresaDto> {
    const empresa = await this.empresaService.findEmpresaById(id);
    return {
      empresa,
      message: 'Empresa encontrada',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza empresa por id' })
  @Role(TipoUsuario.MEI)
  @Role(TipoUsuario.ADMINISTRADOR)
  async updateCompany(
    @Body(ValidationPipe) updateCompanyDto: UpdateEmpresaDto,
    @User() user: Usuario,
    @Param('id') id: string,
  ) {
    if (user.tipo != TipoUsuario.MEI && user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.empresaService.updateCompany(updateCompanyDto, id);
    }
  }
}
