import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';

@Controller('api/v1/endereco')
@ApiTags('Endereco')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class EnderecoController {
  constructor(private enderecoService: EnderecoService) {}
}
