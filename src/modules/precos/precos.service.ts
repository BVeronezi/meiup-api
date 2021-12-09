import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePrecosDto } from './dto/create-precos-dto';
import { Precos } from './precos.entity';
import { PrecosRepository } from './precos.repository';

@Injectable()
export class PrecosService {
  constructor(
    @InjectRepository(PrecosRepository)
    private precosRepository: PrecosRepository,
  ) {}

  async findPrecoById(precosId: string): Promise<Precos> {
    const preco = await this.precosRepository.findOne(precosId);

    if (!preco) throw new NotFoundException('Preço não encontrado');

    return preco;
  }

  async createPrecos(createPrecosDto: CreatePrecosDto): Promise<Precos> {
    return await this.precosRepository.createPrecos(createPrecosDto);
  }

  async deletePreco(precosId: string) {
    const result = await this.precosRepository.delete({ id: precosId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado preço com o ID informado',
      );
    }
  }
}
