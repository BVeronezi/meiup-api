import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindProdutosFornecedoresQueryDto } from './dto/find-produtos-fornecedores-dto';
import { ProdutoFornecedorDto } from './dto/produto-fornecedor-dto';
import { ProdutosFornecedores } from './produtos_fornecedores.entity';
import { ProdutosFornecedoresRepository } from './produtos_fornecedores.repository';

@Injectable()
export class ProdutosFornecedoresService {
  constructor(
    @InjectRepository(ProdutosFornecedoresRepository)
    private produtosFornecedorRepository: ProdutosFornecedoresRepository,
  ) {}

  async findProdutosFornecedor(
    queryDto: FindProdutosFornecedoresQueryDto,
    empresaId: string,
  ): Promise<{ produtosFornecedores: ProdutosFornecedores[]; total: number }> {
    const produtosFornecedores =
      await this.produtosFornecedorRepository.findProdutosFornecedores(
        queryDto,
        empresaId,
      );
    return produtosFornecedores;
  }

  async findProdutosFornecedorById(
    produtoId: string,
    fornecedorId: string,
  ): Promise<ProdutosFornecedores> {
    const produtoFornecedor = await this.produtosFornecedorRepository.findOne({
      where: { fornecedor: fornecedorId, produto: produtoId },
    });

    return produtoFornecedor;
  }

  async createProdutoFornecedor(
    createProdutoFornecedorDto: ProdutoFornecedorDto,
  ): Promise<ProdutosFornecedores> {
    return await this.produtosFornecedorRepository.createProdutoFornecedor(
      createProdutoFornecedorDto,
    );
  }

  async deleteProdutoFornecedor(
    item: any,
    produtoId: string,
    empresaId: string,
  ) {
    const produtoFornecedor = await this.produtosFornecedorRepository.findOne({
      where: {
        id: item.produtoFornecedor,
        produto: produtoId,
        empresa: empresaId,
      },
    });

    return await this.produtosFornecedorRepository.delete({
      id: String(produtoFornecedor.id),
    });
  }
}
