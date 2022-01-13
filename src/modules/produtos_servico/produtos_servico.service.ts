import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindProdutosServicoQueryDto } from './dto/find-produtos-servico-dto';
import { ProdutoServicoDto } from './dto/produto-servico-dto';
import { ProdutosServico } from './produtos_servico.entity';
import { ProdutosServicoRepository } from './produtos_servico.respository';

@Injectable()
export class ProdutosServicoService {
  constructor(
    @InjectRepository(ProdutosServicoRepository)
    private produtosServicoRepository: ProdutosServicoRepository,
  ) {}

  async findProdutosServico(
    queryDto: FindProdutosServicoQueryDto,
    empresaId: string,
  ): Promise<{ produtosServico: ProdutosServico[]; total: number }> {
    const produtosServico =
      await this.produtosServicoRepository.findProdutosServico(
        queryDto,
        empresaId,
      );
    return produtosServico;
  }

  async findProdutosServicoById(
    servicoId: number,
    produtoId: number,
  ): Promise<ProdutosServico> {
    const produtoServico = await this.produtosServicoRepository.findOne({
      where: { servico: servicoId, produto: produtoId },
    });

    return produtoServico;
  }

  async findProduto(produtoId: number) {
    const produtoServico = await this.produtosServicoRepository.count({
      where: { produto: produtoId },
    });

    return produtoServico;
  }

  async createProdutoServico(
    createProdutoServicoDto: ProdutoServicoDto,
  ): Promise<ProdutosServico> {
    return await this.produtosServicoRepository.createProdutoServico(
      createProdutoServicoDto,
    );
  }

  async updateProdutoServico(
    updateProdutoServicoDto: ProdutoServicoDto,
  ): Promise<ProdutosServico> {
    return await this.produtosServicoRepository.updateProdutoServico(
      updateProdutoServicoDto,
    );
  }

  async deleteProdutoServico(item: any, servicoId: number, empresaId: number) {
    const produtoServico = await this.produtosServicoRepository.findOne({
      where: {
        id: item.produtoServico,
        produto: String(item.produto),
        servico: servicoId,
        empresa: empresaId,
      },
    });

    return await this.produtosServicoRepository.delete({
      id: String(produtoServico.id),
    });
  }
}
