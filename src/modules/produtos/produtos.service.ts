import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProdutoDto } from './dto/create-produto-dto';
import { Produtos } from './produtos.entity';
import { ProdutosRepository } from './produtos.repository';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(ProdutosRepository)
    private produtosRepository: ProdutosRepository,
  ) {}

  async createProduto(createProdutoDto: CreateProdutoDto): Promise<Produtos> {
    return await this.produtosRepository.createProduto(createProdutoDto);
  }

  async findProdutoById(produtoId: number): Promise<Produtos> {
    const produto = await this.produtosRepository.findOne(produtoId);

    if (!produto) throw new NotFoundException('Produto não encontrado');

    return produto;
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
