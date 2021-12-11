import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoVendaDto } from './dto/create-produto-venda-dto';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutosVenda } from './produtos_venda.entity';
import { ProdutosVendaRepository } from './produtos_venda.repository';

@Injectable()
export class ProdutosVendaService {
  constructor(
    @InjectRepository(ProdutosVendaRepository)
    private produtosVendaRepository: ProdutosVendaRepository,
  ) {}

  async findProdutosVenda(
    queryDto: FindProdutosVendasQueryDto,
    empresaId: string,
  ) {
    const produtosVenda = await this.produtosVendaRepository.findProdutosVenda(
      queryDto,
      empresaId,
    );
    return produtosVenda;
  }

  async createProdutoVenda(
    createProdutoVendaDto: ProdutoVendaDto,
  ): Promise<ProdutosVenda> {
    return await this.produtosVendaRepository.createProdutoVenda(
      createProdutoVendaDto,
    );
  }

  async deleteProdutoVenda(
    produtos: [number],
    vendaId: number,
    empresaId: number,
  ) {
    const produtosExcluidos = [];

    for (const produto of produtos) {
      const produtoVenda = await this.produtosVendaRepository.findOne({
        where: {
          produtoId: produto,
          venda: vendaId,
          empresaId: empresaId,
        },
      });

      if (produtoVenda) {
        produtosExcluidos.push(produtoVenda.id);
        await this.produtosVendaRepository.delete({
          id: String(produtoVenda.id),
        });
      }
    }

    return produtosExcluidos;
  }
}
