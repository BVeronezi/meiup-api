import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrecosService } from './precos.service';

@Controller('api/v1/precos')
@ApiTags('Preços')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
export class PrecosController {
  constructor(private precosService: PrecosService) {}
}
