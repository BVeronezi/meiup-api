import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutosService } from '../produtos/produtos.service';
import { FindProdutosServicoQueryDto } from '../produtos_servico/dto/find-produtos-servico-dto';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { ServicoVendaDto } from './dto/create-servico-venda-dto';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';
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
  ) {
    const servicosVenda = await this.servicosVendaRepository.findServicosVenda(
      queryDto,
      empresaId,
    );
    return servicosVenda;
  }

  async createServicoVenda(
    createServicosVendaDto: ServicoVendaDto,
  ): Promise<ServicosVenda> {
    return await this.servicosVendaRepository.createServicosVenda(
      createServicosVendaDto,
    );
  }

  async deleteServicoVenda(
    servicos: [number],
    vendaId: number,
    empresaId: number,
  ) {
    const servicosExcluidos = [];

    for (const servico of servicos) {
      const paramsProdutoServico: FindProdutosServicoQueryDto = {
        servicoId: servico,
      };

      const produtosServico =
        await this.produtosServicoService.findProdutosServico(
          paramsProdutoServico,
          String(empresaId),
        );

      for (const item of produtosServico) {
        const produto = await this.produtosService.findProdutoById(
          Number(item.id),
        );

        produto.estoque = Number(produto.estoque) + Number(item.quantidade);

        await produto.save();
      }

      const servicoVenda = await this.servicosVendaRepository.findOne({
        where: {
          servicoId: servico,
          venda: vendaId,
          empresaId: empresaId,
        },
      });

      if (servicoVenda) {
        servicosExcluidos.push(servicoVenda.id);
        await this.servicosVendaRepository.delete({
          id: String(servicoVenda.id),
        });
      }
    }

    return servicosExcluidos;
  }
}
