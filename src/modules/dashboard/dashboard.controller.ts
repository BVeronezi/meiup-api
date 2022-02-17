import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Usuario } from '../usuario/usuario.entity';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../auth/decorators/user.decorator';
import { DashboardService } from './dashboard.service';

@Controller('api/v1/dashboard')
@ApiTags('Dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access-token')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Busca dados da Dashboard',
  })
  async findClientes(@User('usuario') usuario: Usuario) {
    const found = await this.dashboardService.findDados(usuario.empresa.id);
    return {
      found,
    };
  }
}
