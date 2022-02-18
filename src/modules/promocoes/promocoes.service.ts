import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { FindPromocoesQueryDto } from './dto/find-promocoes-query-dto';
import { UpdatePromocaoDto } from './dto/update-promocao-dto';
import { Promocoes } from './promocoes.entity';
import { PromocoesRepository } from './promocoes.repository';

@Injectable()
export class PromocoesService {
  constructor(
    @InjectRepository(PromocoesRepository)
    private promocoesRepository: PromocoesRepository,
  ) {}

  async createPromocao(
    createPromocaoDto: CreatePromocaoDto,
  ): Promise<Promocoes> {
    return await this.promocoesRepository.createPromocao(createPromocaoDto);
  }

  async findPromocaoById(promocaoId: string): Promise<Promocoes> {
    const promocao = await this.promocoesRepository.findOne(promocaoId);

    if (!promocao) throw new NotFoundException('Promoção não encontrado');

    return promocao;
  }

  async findPromocoes(
    queryDto: FindPromocoesQueryDto,
    empresaId: string,
  ): Promise<{ promocoes: Promocoes[]; total: number }> {
    const promocoes = await this.promocoesRepository.findPromocoes(
      queryDto,
      empresaId,
    );
    return promocoes;
  }

  async updatePromocao(updatePromocaoDto: UpdatePromocaoDto, id: string) {
    const result = await this.promocoesRepository.update(
      { id },
      {
        descricao: updatePromocaoDto.descricao,
        produtos: updatePromocaoDto.produtos,
        servicos: updatePromocaoDto.servicos,
        dataInicio: updatePromocaoDto.dataInicio,
        dataFim: updatePromocaoDto.dataFim,
      },
    );

    if (result.affected > 0) {
      return await this.findPromocaoById(id);
    } else {
      throw new NotFoundException('Promoção não encontrado');
    }
  }

  async deletePromocao(promocaoId: string) {
    const result = await this.promocoesRepository.delete({
      id: promocaoId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado promoção com o ID informado',
      );
    }
  }
}
