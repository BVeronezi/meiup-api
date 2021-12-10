import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrecosService } from '../precos/precos.service';
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
    const result = await this.produtosRepository.update(
      { id },
      {
        descricao: updateProdutoDto.descricao,
        tipoItem: updateProdutoDto.tipoItem,
        unidade: updateProdutoDto.unidade,
        categoria: updateProdutoDto.categoria,
        estoque: updateProdutoDto.estoque,
        estoqueMinimo: updateProdutoDto.estoqueMinimo,
        estoqueMaximo: updateProdutoDto.estoqueMaximo,
        fornecedoresProduto: updateProdutoDto.fornecedoresProduto,
      },
    );

    if (result.affected > 0) {
      const produto = await this.findProdutoById(Number(id));

      const precoId = produto.precos ? produto.precos.id : null;

      const precos = await this.precosService.updateOrCreatePrecos(
        updateProdutoDto.precos,
        precoId,
      );

      produto.precos = precos;

      return {
        produto,
        message: 'Produto atualizado com sucesso',
      };
    } else {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async deleteProduto(produtoId: number) {
    const result = await this.produtosRepository.delete({
      id: String(produtoId),
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado produto com o ID informado',
      );
    }
  }
}
