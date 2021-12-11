import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoServicoDto } from './dto/create-produto-servico-dto';
import { FindProdutosServicoQueryDto } from './dto/find-produtos-servico-dto';
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
  ) {
    const produtosServico =
      await this.produtosServicoRepository.findProdutosServico(
        queryDto,
        empresaId,
      );
    return produtosServico;
  }

  async createProdutoServico(
    createProdutoServicoDto: ProdutoServicoDto,
  ): Promise<ProdutosServico> {
    return await this.produtosServicoRepository.createProdutoServico(
      createProdutoServicoDto,
    );
  }

  async deleteProdutoServico(
    produtos: [number],
    servicoId: number,
    empresaId: number,
  ) {
    const produtosExcluidos = [];

    for (const produto of produtos) {
      const produtoServico = await this.produtosServicoRepository.findOne({
        where: {
          produtoId: produto,
          venda: servicoId,
          empresaId: empresaId,
        },
      });

      if (produtoServico) {
        produtosExcluidos.push(produtoServico.id);
        await this.produtosServicoRepository.delete({
          id: String(produtoServico.id),
        });
      }
    }

    return produtosExcluidos;
  }
}
