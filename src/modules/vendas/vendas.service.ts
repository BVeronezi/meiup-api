import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { Vendas } from './vendas.entity';
import { VendasRepository } from './vendas.repository';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendasRepository)
    private vendasRepository: VendasRepository,
  ) {}

  async createVenda(createVendaDto: CreateVendaDto): Promise<Vendas> {
    return await this.vendasRepository.createVenda(createVendaDto);
  }

  async findVendaById(vendaId: number): Promise<Vendas> {
    const venda = await this.vendasRepository.findOne(vendaId);

    if (!venda) throw new NotFoundException('Venda não encontrado');

    return venda;
  }

  async findVendas(
    queryDto: FindVendasQueryDto,
    empresaId: string,
  ): Promise<{ vendas: Vendas[]; total: number }> {
    const vendas = await this.vendasRepository.findVendas(queryDto, empresaId);
    return vendas;
  }
}
