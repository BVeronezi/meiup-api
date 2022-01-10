import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutosService } from '../produtos/produtos.service';
import { FindProdutosVendasQueryDto } from './dto/find-produtos-venda-dto';
import { ProdutoVendaDto } from './dto/produto-venda-dto';
import { ProdutosVenda } from './produtos_venda.entity';
import { ProdutosVendaRepository } from './produtos_venda.repository';

@Injectable()
export class ProdutosVendaService {
  constructor(
    @InjectRepository(ProdutosVendaRepository)
    private produtosVendaRepository: ProdutosVendaRepository,
    private produtoService: ProdutosService,
  ) {}

  async findProdutosVenda(
    queryDto: FindProdutosVendasQueryDto,
    empresaId: string,
  ): Promise<{ produtosVenda: ProdutosVenda[]; total: number }> {
    const produtosVenda = await this.produtosVendaRepository.findProdutosVenda(
      queryDto,
      empresaId,
    );
    return produtosVenda;
  }

  async findProdutosVendaById(
    vendaId: number,
    produtoId: number,
  ): Promise<ProdutosVenda> {
    const produtoVenda = await this.produtosVendaRepository.findOne({
      where: { venda: vendaId, produto: produtoId },
    });

    return produtoVenda;
  }

  async createProdutoVenda(
    createProdutoVendaDto: ProdutoVendaDto,
  ): Promise<ProdutosVenda> {
    return await this.produtosVendaRepository.createProdutoVenda(
      createProdutoVendaDto,
    );
  }

  async updateProdutoVenda(
    updateProdutoVendaDto: ProdutoVendaDto,
  ): Promise<ProdutosVenda> {
    return await this.produtosVendaRepository.updateProdutoVenda(
      updateProdutoVendaDto,
    );
  }

  async deleteProdutoVenda(item: any, vendaId: number) {
    const resultProdutoVenda = await this.produtosVendaRepository.findOne({
      where: {
        id: item.produtoVenda,
        venda: vendaId,
      },
    });

    const produto = await this.produtoService.findProdutoById(
      Number(item.produto),
    );

    produto.estoque =
      Number(produto.estoque) + Number(resultProdutoVenda.quantidade);

    await produto.save();

    return await this.produtosVendaRepository.delete({
      id: String(item.produtoVenda),
    });
  }
}
