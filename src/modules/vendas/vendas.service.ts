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
            pagamento: updateVendaDto.pagamento,
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

    const params: FindProdutosVendasQueryDto = {
      vendaId: Number(venda.id),
      sort: undefined,
      page: 1,
      limit: 100,
    };

    const produtosVenda = await this.produtosVendaService.findProdutosVenda(
      params,
      String(empresa.id),
    );

    if (produtosVenda.length > 0) {
      for (const key of produtosVenda) {
        const produto = await this.produtosService.findProdutoById(
          Number(key.produtoId),
        );

        produto.estoque =
          Number(produto.estoque) + Number(key.produtos_venda_quantidade);

        await produto.save();
      }
    }

    venda.status = StatusVenda.CANCELADA;
    return await venda.save();
  }

  async adicionaProdutoVenda(
    arrProdutos: [{ id: number; quantidade: number }],
    venda: Vendas,
    empresa: Empresa,
  ) {
    if (
      venda.status == StatusVenda.CANCELADA ||
      venda.status == StatusVenda.FINALIZADA
    ) {
      throw new NotFoundException(
        'Venda não está aberta para realizar alterações!',
      );
    }

    const params: FindProdutosVendasQueryDto = {
      vendaId: Number(venda.id),
      sort: undefined,
      page: 1,
      limit: 100,
    };

    const produtosVenda = await this.produtosVendaService.findProdutosVenda(
      params,
      String(empresa.id),
    );

    const arrNovosProdutos = arrProdutos
      .map((e) => e.id)
      .filter((p) => !produtosVenda.map((p) => p.produtoId).includes(p));

    for (const item of arrProdutos) {
      if (arrNovosProdutos.includes(item.id)) {
        const produto = await this.produtosService.findProdutoById(
          Number(item.id),
        );

        produto.estoque = Number(produto.estoque) - Number(item.quantidade);

        await produto.save();

        const params = {
          produto: produto,
          quantidade: item.quantidade,
          venda: venda,
          empresa: empresa,
        };

        await this.produtosVendaService.createProdutoVenda(params);
      }
    }
  }

  async baixaEstoqueProdutoServico(
    createVendaDto: CreateVendaDto,
    empresa: Empresa,
  ) {
    const servicosVenda = [];
    for (const servicoId of createVendaDto.servicos) {
      const servico = await this.servicoService.findServicoById(
        Number(servicoId),
      );

      const params: FindProdutosServicoQueryDto = {
        servicoId: Number(servico.id),
        sort: undefined,
        page: 1,
        limit: 100,
      };

      const produtosServico =
        await this.produtosServicoService.findProdutosServico(
          params,
          empresa.id,
        );

      for (const item of produtosServico) {
        const produto = await this.produtosService.findProdutoById(
          Number(item.id),
        );

        produto.estoque = Number(produto.estoque) - Number(item.quantidade);

        await produto.save();
      }
    }

    return (createVendaDto.servicos = servicosVenda);
  }

  async findVendas(
    queryDto: FindVendasQueryDto,
    empresaId: string,
  ): Promise<{ vendas: Vendas[]; total: number }> {
    const vendas = await this.vendasRepository.findVendas(queryDto, empresaId);
    return vendas;
  }
}
