import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindProdutosPromocaoQueryDto } from './dto/find-produtos-promocao-dto';
import { ProdutoPromocaoDto } from './dto/produtos-promoca-dto';
import { ProdutosPromocao } from './produtos_promocao.entity';
import { ProdutosPromocaoRepository } from './produtos_promocao.repository';
import * as moment from 'moment';
import { getManager } from 'typeorm';
@Injectable()
export class ProdutosPromocaoService {
  constructor(
    @InjectRepository(ProdutosPromocaoRepository)
    private produtosPromocaoRepository: ProdutosPromocaoRepository,
  ) {}

  async findProdutosPromocao(
    queryDto: FindProdutosPromocaoQueryDto,
    empresaId: string,
  ): Promise<{ produtosPromocao: ProdutosPromocao[]; total: number }> {
    const produtosPromocao =
      await this.produtosPromocaoRepository.findProdutosPromocao(
        queryDto,
        empresaId,
      );
    return produtosPromocao;
  }

  async findProdutosPromocaoById(
    promocaoId: string,
    produtoId: string,
  ): Promise<ProdutosPromocao> {
    const produtoPromocao = await this.produtosPromocaoRepository.findOne({
      where: { promocao: promocaoId, produto: produtoId },
    });

    return produtoPromocao;
  }

  async findProdutoPromocaoAtiva(
    produtoId: string,
    empresaId: string,
  ): Promise<ProdutosPromocao> {
    const entityManager = getManager();
    const hoje = moment().format('YYYY-MM-DD');

    const promocao = await entityManager.query(`
    select
      pp."produtoId" ,
      pp."precoPromocional" ,
      p."dataFim" 
    from
      produtos_promocao pp
    left join promocoes p on
      p.id = pp."promocaoId"
    where
      "produtoId" = ${produtoId}
      and pp."empresaId" = ${empresaId}
      and p."dataFim" >= '${hoje}' 
    `);

    return promocao;
  }

  async findProduto(produtoId: number) {
    const produtoPromocao = await this.produtosPromocaoRepository.count({
      where: { produto: produtoId },
    });

    return produtoPromocao;
  }

  async createProdutoPromocao(
    createProdutoPromocaoDto: ProdutoPromocaoDto,
  ): Promise<ProdutosPromocao> {
    return await this.produtosPromocaoRepository.createProdutoPromocao(
      createProdutoPromocaoDto,
    );
  }

  async updateProdutoPromocao(
    updateProdutoPromocaoDto: ProdutoPromocaoDto,
  ): Promise<ProdutosPromocao> {
    return await this.produtosPromocaoRepository.updateProdutoPromocao(
      updateProdutoPromocaoDto,
    );
  }

  async deleteProdutoPromocao(
    item: any,
    promocaoId: string,
    empresaId: string,
  ) {
    const produtoPromocao = await this.produtosPromocaoRepository.findOne({
      where: {
        id: item.produtoPromocao,
        produto: String(item.produto),
        promocao: promocaoId,
        empresa: empresaId,
      },
    });

    return await this.produtosPromocaoRepository.delete({
      id: String(produtoPromocao.id),
    });
  }
}
