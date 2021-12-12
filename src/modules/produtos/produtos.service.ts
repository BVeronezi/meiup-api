import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FornecedoresService } from '../fornecedores/fornecedores.service';
import { PrecosService } from '../precos/precos.service';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { FindProdutosQueryDto } from './dto/find-produtos-query-dto';
import { FornecedorProdutoDto } from './dto/fornecedor-produto-dto';
import { UpdateProdutoDto } from './dto/update-produto-dto';
import { Produtos } from './produtos.entity';
import { ProdutosRepository } from './produtos.repository';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(ProdutosRepository)
    private produtosRepository: ProdutosRepository,
    private precosService: PrecosService,
    private fornecedoresService: FornecedoresService,
  ) {}

  async createProduto(createProdutoDto: CreateProdutoDto): Promise<Produtos> {
    return await this.produtosRepository.createProduto(createProdutoDto);
  }

  async findProdutoById(produtoId: number): Promise<Produtos> {
    const produto = await this.produtosRepository.findOne(produtoId);

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
    const produto = await this.findProdutoById(Number(id));

    if (produto) {
      const fornecedoresProduto = produto.fornecedoresProduto;
      const fornecedoresCadastrados = [];
      const precoId = produto.precos ? produto.precos.id : null;

      if (updateProdutoDto.precos) {
        const precos = await this.precosService.updateOrCreatePrecos(
          updateProdutoDto.precos,
          precoId,
        );

        produto.precos = precos;
        await produto.save();
      }

      if (updateProdutoDto.fornecedoresProduto.length > 0) {
        for (const fornecedorCadastrado of produto.fornecedoresProduto) {
          fornecedoresCadastrados.push(fornecedorCadastrado.id);
        }

        for (const idFornecedor of updateProdutoDto.fornecedoresProduto) {
          const fornecedorJaCadastrado = fornecedoresCadastrados.filter(
            (f) => f !== idFornecedor,
          );

          if (fornecedorJaCadastrado.length > 0) {
            const fornecedor =
              await this.fornecedoresService.findFornecedorById(
                Number(idFornecedor),
              );

            fornecedoresProduto.push(fornecedor);
          }
        }

        produto.fornecedoresProduto = fornecedoresProduto;
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

      return {
        produto,
        message: 'Produto atualizado com sucesso',
      };
    } else {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async deleteFornecedorProduto(
    fornecedorProdutoDto: FornecedorProdutoDto,
    produtoId: number,
  ) {
    try {
      const produto = await this.findProdutoById(Number(produtoId));
      const fornecedoresCadastrados = [];
      const newFornecedoresProdutos = [];

      for (const fornecedorCadastrado of produto.fornecedoresProduto) {
        fornecedoresCadastrados.push(fornecedorCadastrado.id);
      }

      produto.fornecedoresProduto = fornecedoresCadastrados.filter(
        (fornecedor) => !fornecedorProdutoDto.fornecedores.includes(fornecedor),
      );

      for (const idFornecedor of produto.fornecedoresProduto) {
        const fornecedor = await this.fornecedoresService.findFornecedorById(
          Number(idFornecedor),
        );

        newFornecedoresProdutos.push(fornecedor);
      }

      produto.fornecedoresProduto = newFornecedoresProdutos;
      return await produto.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduto(produtoId: number) {
    const produto = await this.findProdutoById(produtoId);

    if (produto.precos) {
      await this.precosService.deletePreco(produto.precos.id);
    }

    await this.produtosRepository.delete({
      id: String(produtoId),
    });
  }
}
