import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { FindServicosPromocaoQueryDto } from './dto/find-servicos_promocao-dto';
import { ServicoPromocaoDto } from './dto/servicos_promocao-dto';
import { ServicosPromocao } from './servicos_promocao.entity';
import { ServicosPromocaoRepository } from './servicos_promocao.repository';
import * as moment from 'moment';
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

  async findServicoPromocaoAtiva(
    servicoId: string,
    empresaId: string,
  ): Promise<ServicosPromocao> {
    const entityManager = getManager();
    const hoje = moment().format('YYYY-MM-DD');

    const promocao = await entityManager.query(`
    select
      sp."servicoId" ,
      sp."precoPromocional" ,
      p."dataFim" 
    from
      servicos_promocao sp
    left join promocoes p on
      p.id = sp."promocaoId"
    where
      "servicoId" = ${servicoId}
      and sp."empresaId" = ${empresaId}
      and p."dataFim" >= '${hoje}' 
    `);

    return promocao;
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
