import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicoVendaDto } from './dto/create-servico-venda-dto';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';
import { ServicosVenda } from './servicos_venda.entity';
import { ServicosVendaRepository } from './servicos_venda.repository';

@Injectable()
export class ServicosVendaService {
  constructor(
    @InjectRepository(ServicosVendaRepository)
    private servicosVendaRepository: ServicosVendaRepository,
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
