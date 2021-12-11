import { EntityRepository, Repository } from 'typeorm';
import { ServicoVendaDto } from './dto/create-servico-venda-dto';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';
import { ServicosVenda } from './servicos_venda.entity';

@EntityRepository(ServicosVenda)
export class ServicosVendaRepository extends Repository<ServicosVenda> {
  async findServicosVenda(
    queryDto: FindServicosVendasQueryDto,
    empresaId: string,
  ) {
    const { vendaId } = queryDto;
    const query = this.createQueryBuilder('servicos_venda');

    query.andWhere('servicos_venda.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('servicos_venda.vendaId = :vendaId', {
      vendaId: vendaId,
    });
    query.select([
      'servicos_venda.id',
      'servicos_venda.servicoId',
      'servicos_venda.vendaId',
      'servicos_venda.empresaId',
    ]);

    const servicosVenda = await query.getRawMany();

    return servicosVenda;
  }

  async createServicosVenda(
    createServicosVendaDto: ServicoVendaDto,
  ): Promise<ServicosVenda> {
    const { servico, venda, empresa } = createServicosVendaDto;

    const servicosVenda = this.create();
    servicosVenda.servico = servico;
    servicosVenda.venda = venda;
    servicosVenda.empresa = empresa;

    try {
      return await servicosVenda.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
