import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';

@Controller('api/v1/endereco')
@ApiTags('Endereco')
export class EnderecoController {
  constructor(private enderecoService: EnderecoService) {}
}
