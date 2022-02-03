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
import { GetUser } from '../auth/get-user.decorator';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { EmpresaService } from './empresa.service';
import { ReturnEmpresaDto } from './dto/return-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('api/v1/empresa')
@ApiTags('Empresa')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access-token')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca empresa por id' })
  @Role(UserRole.MEI)
  async findCompanyById(@Param('id') id): Promise<ReturnEmpresaDto> {
    const empresa = await this.empresaService.findEmpresaById(id);
    return {
      empresa,
      message: 'Empresa encontrada',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza empresa por id' })
  @Role(UserRole.MEI)
  @Role(UserRole.ADMIN)
  async updateCompany(
    @Body(ValidationPipe) updateCompanyDto: UpdateEmpresaDto,
    @GetUser() user: Usuario,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.MEI && user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.empresaService.updateCompany(updateCompanyDto, id);
    }
  }
}
