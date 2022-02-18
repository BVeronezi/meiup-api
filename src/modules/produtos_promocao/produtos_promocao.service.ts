import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindProdutosPromocaoQueryDto } from './dto/find-produtos-promocao-dto';
import { ProdutoPromocaoDto } from './dto/produtos-promoca-dto';
import { ProdutosPromocao } from './produtos_promocao.entity';
import { ProdutosPromocaoRepository } from './produtos_promocao.repository';

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
        id: item.id,
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
