import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { Endereco } from './endereco.entity';
import { EnderecoRepository } from './endereco.repository';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(EnderecoRepository)
    private enderecoRepository: EnderecoRepository,
  ) {}

  async updateOrCreateEndereco(
    createEnderecoDto: CreateEnderecoDto,
    id: string,
  ): Promise<Endereco> {
    const endereco = await this.findEnderecoById(id);

    if (endereco) {
      const result = await this.enderecoRepository.update(
        { id },
        createEnderecoDto,
      );

      if (result.affected > 0) {
        const endereco = await this.findEnderecoById(id);

        return endereco;
      }
    } else {
      return this.enderecoRepository.createEndereco(createEnderecoDto);
    }
  }

  async findEnderecoById(enderecoId: string): Promise<Endereco> {
    const endereco = await this.enderecoRepository.findOne(enderecoId);

    if (!endereco) throw new NotFoundException('Endereco não encontrada');

    return endereco;
  }
}
