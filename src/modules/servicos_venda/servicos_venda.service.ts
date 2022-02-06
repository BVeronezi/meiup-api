import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutosService } from '../produtos/produtos.service';
import { FindProdutosServicoQueryDto } from '../produtos_servico/dto/find-produtos-servico-dto';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';
import { ServicoVendaDto } from './dto/servico-venda-dto';
import { ServicosVenda } from './servicos_venda.entity';
import { ServicosVendaRepository } from './servicos_venda.repository';

@Injectable()
export class ServicosVendaService {
  constructor(
    @InjectRepository(ServicosVendaRepository)
    private servicosVendaRepository: ServicosVendaRepository,
    private produtosService: ProdutosService,
    private produtosServicoService: ProdutosServicoService,
  ) {}

  async findServicosVenda(
    queryDto: FindServicosVendasQueryDto,
    empresaId: string,
  ): Promise<{ servicosVenda: ServicosVenda[]; total: number }> {
    const servicosVenda = await this.servicosVendaRepository.findServicosVenda(
      queryDto,
      empresaId,
    );
    return servicosVenda;
  }

  async findProdutosVendaById(
    vendaId: string,
    produtoId: string,
  ): Promise<ServicosVenda> {
    const servicoVenda = await this.servicosVendaRepository.findOne({
      where: { venda: vendaId, servico: produtoId },
    });

    return servicoVenda;
  }

  async createServicoVenda(
    createServicosVendaDto: ServicoVendaDto,
  ): Promise<ServicosVenda> {
    return await this.servicosVendaRepository.createServicosVenda(
      createServicosVendaDto,
    );
  }

  async updateServicoVenda(
    updateServicoVendaDto: ServicoVendaDto,
  ): Promise<ServicosVenda> {
    return await this.servicosVendaRepository.updateServicoVenda(
      updateServicoVendaDto,
    );
  }

  async deleteServicoVenda(item: any, vendaId: number, empresaId: number) {
    const servicosVenda = await this.servicosVendaRepository.findOne({
      where: {
        id: item.servicoVenda,
        servico: item.servico,
        venda: vendaId,
        empresa: empresaId,
      },
    });

    const paramsProdutoServico: FindProdutosServicoQueryDto = {
      servicoId: item.servico,
    };

    const response = await this.produtosServicoService.findProdutosServico(
      paramsProdutoServico,
      String(empresaId),
    );

    for (const item of response.produtosServico) {
      const produto = await this.produtosService.findProdutoById(
        String(item.produto.id),
      );
      produto.estoque = Number(produto.estoque) + Number(item.quantidade);
      await produto.save();
    }

    return await this.servicosVendaRepository.delete({
      id: String(servicosVenda.id),
    });
  }
}
