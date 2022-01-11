import { EntityRepository, Repository } from 'typeorm';
import { FindServicosVendasQueryDto } from './dto/find-servicos-venda-dto';
import { ServicoVendaDto } from './dto/servico-venda-dto';
import { ServicosVenda } from './servicos_venda.entity';

@EntityRepository(ServicosVenda)
export class ServicosVendaRepository extends Repository<ServicosVenda> {
  async findServicosVenda(
    queryDto: FindServicosVendasQueryDto,
    empresaId: string,
  ): Promise<{ servicosVenda: ServicosVenda[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 10 ? 10 : queryDto.limit ?? 10;

    const { vendaId } = queryDto;
    const query = this.createQueryBuilder('servicos_venda');

    query.andWhere('servicos_venda.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    query.andWhere('servicos_venda.vendaId = :vendaId', {
      vendaId: vendaId,
    });

    query.skip((Number(queryDto.page) - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);

    query.select([
      'servicos_venda.id',
      'servico',
      'servicos_venda.precoUnitario',
      'servicos_venda.outrasDespesas',
      'servicos_venda.desconto',
      'servicos_venda.valorTotal',
      'servicos_venda.vendaId',
      'servicos_venda.empresaId',
    ]);
    query.leftJoin('produtos_venda.servico', 'servico');

    const [servicosVenda, total] = await query.getManyAndCount();

    return { servicosVenda, total };
  }

  async createServicosVenda(
    createServicosVendaDto: ServicoVendaDto,
  ): Promise<ServicosVenda> {
    const {
      servico,
      precoUnitario,
      outrasDespesas,
      desconto,
      valorTotal,
      venda,
      empresa,
    } = createServicosVendaDto;

    const servicosVenda = this.create();
    servicosVenda.servico = servico;
    servicosVenda.precoUnitario = Number(precoUnitario);
    servicosVenda.outrasDespesas = Number(outrasDespesas);
    servicosVenda.desconto = Number(desconto);
    servicosVenda.valorTotal = +Number(valorTotal);
    servicosVenda.venda = venda;
    servicosVenda.empresa = empresa;

    try {
      return await servicosVenda.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateServicoVenda(
    updateServicoVendaDto: ServicoVendaDto,
  ): Promise<ServicosVenda> {
    const { id, servico, precoUnitario, outrasDespesas, desconto, valorTotal } =
      updateServicoVendaDto;

    try {
      await this.update(
        { id },
        {
          servico,
          precoUnitario,
          outrasDespesas,
          desconto,
          valorTotal,
        },
      );
    } catch (error) {
      throw new Error(error.message);
    }

    return;
  }
}
