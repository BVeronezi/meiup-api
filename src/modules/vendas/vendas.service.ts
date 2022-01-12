import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from '../clientes/clientes.service';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { FindProdutosServicoQueryDto } from '../produtos_servico/dto/find-produtos-servico-dto';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { FindProdutosVendasQueryDto } from '../produtos_venda/dto/find-produtos-venda-dto';
import { ProdutosVendaService } from '../produtos_venda/produtos_venda.service';
import { ServicosService } from '../servicos/servicos.service';
import { FindServicosVendasQueryDto } from '../servicos_venda/dto/find-servicos-venda-dto';
import { ServicosVendaService } from '../servicos_venda/servicos_venda.service';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { StatusVenda } from './enum/venda-status-enum';
import { Vendas } from './vendas.entity';
import { VendasRepository } from './vendas.repository';
@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendasRepository)
    private vendasRepository: VendasRepository,
    private clienteService: ClientesService,
    private produtosVendaService: ProdutosVendaService,
    private servicosVendaService: ServicosVendaService,
    private produtosService: ProdutosService,
    private produtosServicoService: ProdutosServicoService,
    private servicoService: ServicosService,
  ) {}

  async createVenda(createVendaDto: CreateVendaDto): Promise<Vendas> {
    return await this.vendasRepository.createVenda(createVendaDto);
  }

  async findVendaById(vendaId: number): Promise<Vendas> {
    const venda = await this.vendasRepository.findOne(vendaId);

    if (!venda) throw new NotFoundException('Venda não encontrado');

    return venda;
  }

  async updateVenda(updateVendaDto: UpdateVendaDto, id: string) {
    const venda = await this.findVendaById(Number(id));

    if (
      venda.status == StatusVenda.CANCELADA ||
      venda.status == StatusVenda.FINALIZADA
    ) {
      throw new NotFoundException(
        'Venda não está aberta para realizar alterações!',
      );
    }

    if (venda) {
      if (Number(venda.cliente.id) !== Number(updateVendaDto.cliente)) {
        const cliente = await this.clienteService.findClienteById(
          Number(updateVendaDto.cliente),
        );

        venda.cliente = cliente;
        await venda.save();
      }

      try {
        await this.vendasRepository.update(
          { id },
          {
            valorTotal: updateVendaDto.valorTotal,
            pagamento: updateVendaDto.pagamento,
            troco: updateVendaDto.valorTroco,
          },
        );
      } catch (error) {
        throw new Error(error.message);
      }

      return {
        venda,
        message: 'Venda atualizada com sucesso',
      };
    } else {
      throw new NotFoundException('Venda não encontrada');
    }
  }

  async finalizaVenda(vendaId: number): Promise<Vendas> {
    const venda = await this.findVendaById(vendaId);

    if (venda.status == StatusVenda.CANCELADA) {
      throw new NotFoundException('Venda cancelada, não é possível finalizar!');
    }

    if (venda.status == StatusVenda.FINALIZADA) {
      throw new NotFoundException('Venda já finalizada!');
    }

    venda.status = StatusVenda.FINALIZADA;
    return await venda.save();
  }

  async cancelaVenda(vendaId: number, empresa: Empresa): Promise<Vendas> {
    const venda = await this.findVendaById(vendaId);

    if (venda.status == StatusVenda.FINALIZADA) {
      throw new NotFoundException('Venda finalizada, não é possível cancelar!');
    }

    if (venda.status == StatusVenda.CANCELADA) {
      throw new NotFoundException('Venda já cancelada');
    }

    await this.estornoEstoqueProdutoVenda(Number(venda.id), String(empresa.id));
    await this.estornoEstoqueProdutoServicoVenda(
      Number(venda.id),
      String(empresa.id),
    );

    venda.status = StatusVenda.CANCELADA;
    return await venda.save();
  }

  async estornoEstoqueProdutoServicoVenda(vendaId: number, empresaId: string) {
    const params: FindServicosVendasQueryDto = {
      vendaId: vendaId,
      sort: undefined,
    };

    const response = await this.servicosVendaService.findServicosVenda(
      params,
      empresaId,
    );

    if (response.servicosVenda.length > 0) {
      for (const key of response.servicosVenda) {
        const paramsProdutoServico: FindProdutosServicoQueryDto = {
          servicoId: Number(key.servico.id),
          sort: undefined,
        };

        const responseProdutoServico =
          await this.produtosServicoService.findProdutosServico(
            paramsProdutoServico,
            empresaId,
          );

        if (responseProdutoServico.produtosServico.length > 0) {
          for (const key of responseProdutoServico.produtosServico) {
            const produto = await this.produtosService.findProdutoById(
              Number(key.produto.id),
            );

            produto.estoque = Number(produto.estoque) + Number(key.quantidade);

            await produto.save();
          }
        }
      }
    }

    return;
  }

  async estornoEstoqueProdutoVenda(vendaId: number, empresaId: string) {
    const params: FindProdutosVendasQueryDto = {
      vendaId: vendaId,
      sort: undefined,
    };

    const response = await this.produtosVendaService.findProdutosVenda(
      params,
      empresaId,
    );

    if (response.produtosVenda.length > 0) {
      for (const key of response.produtosVenda) {
        const produto = await this.produtosService.findProdutoById(
          Number(key.produto?.id),
        );

        produto.estoque = Number(produto.estoque) + Number(key.quantidade);

        await produto.save();
      }
    }

    return;
  }

  async adicionaProdutoVenda(item: any, venda: Vendas, empresa: Empresa) {
    if (
      venda.status == StatusVenda.CANCELADA ||
      venda.status == StatusVenda.FINALIZADA
    ) {
      throw new NotFoundException(
        'Venda não está aberta para realizar alterações!',
      );
    }

    let produtoVenda;

    const response = await this.produtosVendaService.findProdutosVendaById(
      Number(venda.id),
      Number(item.produto),
    );

    if (!response) {
      const produto = await this.baixaEstoqueProdutoVenda(item);

      const params = {
        id: null,
        produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        outrasDespesas: item.outrasDespesas,
        desconto: item.desconto,
        valorTotal: item.valorTotal,
        venda: venda,
        empresa: empresa,
      };

      produtoVenda = await this.produtosVendaService.createProdutoVenda(params);
    } else {
      await this.estornoEstoqueProdutoVenda(
        Number(venda.id),
        String(empresa.id),
      );

      const produto: any = await this.baixaEstoqueProdutoVenda(item);

      const params = {
        id: String(response.id),
        produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        outrasDespesas: item.outrasDespesas,
        desconto: item.desconto,
        valorTotal: item.valorTotal,
        venda: venda,
        empresa: empresa,
      };

      try {
        produtoVenda = await this.produtosVendaService.updateProdutoVenda(
          params,
        );
      } catch (error) {
        throw new Error(error.message);
      }
    }

    const valorTotal = await this.calculaTotalVenda(
      Number(venda.id),
      String(empresa.id),
    );
    venda.valorTotal = valorTotal;
    await venda.save();

    return { produtoVenda, valorTotal };
  }

  async adicionaServicoVenda(item: any, venda: Vendas, empresa: Empresa) {
    if (
      venda.status == StatusVenda.CANCELADA ||
      venda.status == StatusVenda.FINALIZADA
    ) {
      throw new NotFoundException(
        'Venda não está aberta para realizar alterações!',
      );
    }

    let servicoVenda;

    const response = await this.servicosVendaService.findProdutosVendaById(
      Number(venda.id),
      Number(item.servico),
    );

    const servico = await this.servicoService.findServicoById(item.servico);

    if (!response) {
      await this.baixaEstoqueProdutoServico(
        Number(servico.id),
        String(empresa.id),
      );

      const params = {
        id: null,
        servico: servico,
        valorServico: item.valorServico,
        outrasDespesas: item.outrasDespesas,
        desconto: item.desconto,
        valorTotal: item.valorTotal,
        venda: venda,
        empresa: empresa,
      };

      await this.servicosVendaService.createServicoVenda(params);
    } else {
      await this.estornoEstoqueProdutoServicoVenda(
        Number(venda.id),
        String(empresa.id),
      );

      await this.baixaEstoqueProdutoServico(
        Number(servico.id),
        String(empresa.id),
      );

      const params = {
        id: response.id,
        servico: servico,
        valorServico: item.valorServico,
        outrasDespesas: item.outrasDespesas,
        desconto: item.desconto,
        valorTotal: item.valorTotal,
        venda: venda,
        empresa: empresa,
      };

      try {
        await this.servicosVendaService.updateServicoVenda(params);
      } catch (error) {
        throw new Error(error.message);
      }
    }

    const valorTotal = await this.calculaTotalVenda(
      Number(venda.id),
      String(empresa.id),
    );
    venda.valorTotal = valorTotal;
    await venda.save();

    return { servicoVenda, valorTotal };
  }

  async baixaEstoqueProdutoVenda(item) {
    const produto = await this.produtosService.findProdutoById(
      Number(item.produto),
    );

    produto.estoque = Number(produto.estoque) - Number(item.quantidade);

    return await produto.save();
  }

  async baixaEstoqueProdutoServico(servicoId: number, empresaId: string) {
    const paramsProdutoServico: FindProdutosServicoQueryDto = {
      servicoId: servicoId,
    };

    const response = await this.produtosServicoService.findProdutosServico(
      paramsProdutoServico,
      empresaId,
    );

    if (response.produtosServico.length > 0) {
      for (const item of response.produtosServico) {
        const produto = await this.produtosService.findProdutoById(
          Number(item.produto.id),
        );

        produto.estoque = Number(produto.estoque) - Number(item.quantidade);

        await produto.save();
      }
    }

    return;
  }

  async findVendas(
    queryDto: FindVendasQueryDto,
    empresaId: string,
  ): Promise<{ vendas: Vendas[]; total: number }> {
    const vendas = await this.vendasRepository.findVendas(queryDto, empresaId);
    return vendas;
  }

  async calculaTotalVenda(vendaId: number, empresaId: string) {
    let valorTotal = 0;

    const paramsProduto: FindProdutosVendasQueryDto = {
      vendaId: vendaId,
    };

    const resultProdutosVenda =
      await this.produtosVendaService.findProdutosVenda(
        paramsProduto,
        empresaId,
      );

    for (const produtoVenda of resultProdutosVenda.produtosVenda) {
      valorTotal += Number(produtoVenda.valorTotal);
    }

    const paramsServico: FindServicosVendasQueryDto = {
      vendaId: vendaId,
    };

    const resultServicosVenda =
      await this.servicosVendaService.findServicosVenda(
        paramsServico,
        empresaId,
      );

    for (const servicoVenda of resultServicosVenda.servicosVenda) {
      valorTotal += Number(servicoVenda.valorTotal);
    }

    return valorTotal;
  }
}
