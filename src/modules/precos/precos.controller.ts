import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { PrecosService } from './precos.service';

@Controller('api/v1/precos')
@ApiTags('Preços')
@UseGuards(AuthGuard())
export class PrecosController {
  constructor(private precosService: PrecosService) {}
}
