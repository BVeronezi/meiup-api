import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario/usuario.entity';
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
    usuario?: Usuario,
  ): Promise<Endereco> {
    if (id) {
      const result = await this.enderecoRepository.update(
        { id },
        createEnderecoDto,
      );

      if (result.affected > 0) {
        const endereco = await this.findEnderecoById(id);

        return endereco;
      }
    } else {
      return this.enderecoRepository.createEndereco(createEnderecoDto, usuario);
    }
  }

  async findEnderecoById(enderecoId: string): Promise<Endereco> {
    const endereco = await this.enderecoRepository.findOne(enderecoId);

    if (!endereco) throw new NotFoundException('Endereco não encontrada');

    return endereco;
  }

  async deleteEndereco(enderecoId: string) {
    const result = await this.enderecoRepository.delete({ id: enderecoId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado endereco com o ID informado',
      );
    }
  }
}
