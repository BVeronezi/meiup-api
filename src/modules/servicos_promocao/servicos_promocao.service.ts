import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindServicosPromocaoQueryDto } from './dto/find-servicos_promocao-dto';
import { ServicoPromocaoDto } from './dto/servicos_promocao-dto';
import { ServicosPromocao } from './servicos_promocao.entity';
import { ServicosPromocaoRepository } from './servicos_promocao.repository';

@Injectable()
export class ServicosPromocaoService {
  constructor(
    @InjectRepository(ServicosPromocaoRepository)
    private servicosPromocaoRepository: ServicosPromocaoRepository,
  ) {}

  async findServicosPromocao(
    queryDto: FindServicosPromocaoQueryDto,
    empresaId: string,
  ): Promise<{ servicosPromocao: ServicosPromocao[]; total: number }> {
    const servicosPromocao =
      await this.servicosPromocaoRepository.findServicosPromocao(
        queryDto,
        empresaId,
      );
    return servicosPromocao;
  }

  async findServicosPromocaoById(
    promocaoId: string,
    servicoId: string,
  ): Promise<ServicosPromocao> {
    const servicosPromocao = await this.servicosPromocaoRepository.findOne({
      where: { promocao: promocaoId, servico: servicoId },
    });

    return servicosPromocao;
  }

  async findProduto(produtoId: number) {
    const servicosPromocao = await this.servicosPromocaoRepository.count({
      where: { produto: produtoId },
    });

    return servicosPromocao;
  }

  async createServicoPromocao(
    createServicoPromocaoDto: ServicoPromocaoDto,
  ): Promise<ServicosPromocao> {
    return await this.servicosPromocaoRepository.createServicoPromocao(
      createServicoPromocaoDto,
    );
  }

  async updateServicoPromocao(
    updateServicoPromocaoDto: ServicoPromocaoDto,
  ): Promise<ServicosPromocao> {
    return await this.servicosPromocaoRepository.updateServicoPromocao(
      updateServicoPromocaoDto,
    );
  }

  async deleteServicoPromocao(
    item: any,
    promocaoId: string,
    empresaId: string,
  ) {
    const servicoPromocao = await this.servicosPromocaoRepository.findOne({
      where: {
        id: item.servicoPromocao,
        servico: String(item.servico),
        promocao: promocaoId,
        empresa: empresaId,
      },
    });

    return await this.servicosPromocaoRepository.delete({
      id: String(servicoPromocao.id),
    });
  }
}
