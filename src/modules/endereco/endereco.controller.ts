import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';

@Controller('api/v1/endereco')
@ApiTags('Endereco')
@UseGuards(AuthGuard())
export class EnderecoController {
  constructor(private enderecoService: EnderecoService) {}
}
