import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorias } from '../categorias/categorias.entity';
import { Empresa } from '../empresa/empresa.entity';
import { PrecosService } from '../precos/precos.service';
import { FindProdutosFornecedoresQueryDto } from '../produtos_fornecedores/dto/find-produtos-fornecedores-dto';
import { ProdutosFornecedoresService } from '../produtos_fornecedores/produtos_fornecedores.service';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { UpdateProdutoDto } from './dto/update-produto-dto';
import { Produtos } from './produtos.entity';
import { ProdutosRepository } from './produtos.repository';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(ProdutosRepository)
    private produtosRepository: ProdutosRepository,
    private precosService: PrecosService,
    private produtoServicoService: ProdutosServicoService,
    private produtoFornecedoresService: ProdutosFornecedoresService,
  ) {}

  async createProduto(
    createProdutoDto: CreateProdutoDto,
    categoria: Categorias,
    empresa: Empresa,
  ): Promise<Produtos> {
    return await this.produtosRepository.createProduto(
      createProdutoDto,
      categoria,
      empresa,
    );
  }

  async findProdutoById(produtoId: string): Promise<Produtos> {
    const produto: any = await this.produtosRepository.findOne(produtoId);

    if (!produto) throw new NotFoundException('Produto não encontrado');

    return produto;
  }

  async findProdutos(
    queryDto: FindProdutosQueryDto,
    empresaId: string,
  ): Promise<{ produtos: Produtos[]; total: number }> {
    const produtos = await this.produtosRepository.findProdutos(
      queryDto,
      empresaId,
    );
    return produtos;
  }

  async updateProduto(updateProdutoDto: UpdateProdutoDto, id: string) {
    const produto = await this.findProdutoById(id);

    if (produto) {
      const precoId = produto.precos ? produto.precos.id : null;

      if (updateProdutoDto.precos) {
        const precos = await this.precosService.updateOrCreatePrecos(
          updateProdutoDto.precos,
          precoId,
        );

        produto.precos = precos;
        await produto.save();
      }

      try {
        await this.produtosRepository.update(
          { id },
          {
            descricao: updateProdutoDto.descricao,
            tipoItem: updateProdutoDto.tipoItem,
            unidade: updateProdutoDto.unidade,
            categoria: updateProdutoDto.categoria,
            estoque: updateProdutoDto.estoque ?? 0,
            estoqueMinimo: updateProdutoDto.estoqueMinimo ?? 0,
            estoqueMaximo: updateProdutoDto.estoqueMaximo ?? 0,
          },
        );
      } catch (error) {
        throw new Error(error.message);
      }

      return produto;
    } else {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async deleteProduto(produtoId: string, empresaId: string) {
    const produto = await this.findProdutoById(produtoId);

    const paramsFornecedores: FindProdutosFornecedoresQueryDto = {
      produtoId,
    };

    const fornecedores =
      await this.produtoFornecedoresService.findProdutosFornecedor(
        paramsFornecedores,
        empresaId,
      );

    if (fornecedores?.produtosFornecedores.length > 0) {
      for (const fornecedor of fornecedores.produtosFornecedores) {
        await this.produtoFornecedoresService.deleteProdutoFornecedor(
          { produtoFornecedor: fornecedor.id },
          produtoId,
          empresaId,
        );
      }
    }

    const produtoServico = await this.produtoServicoService.findProduto(
      Number(produto.id),
    );

    if (produtoServico > 0) {
      return false;
    } else {
      if (produto.precos) {
        await this.precosService.deletePreco(produto.precos.id);
      }
      return await this.produtosRepository.delete({
        id: String(produtoId),
      });
    }
  }
}
