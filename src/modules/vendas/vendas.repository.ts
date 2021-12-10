import { EntityRepository, Repository } from 'typeorm';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { Vendas } from './vendas.entity';

@EntityRepository(Vendas)
export class VendasRepository extends Repository<Vendas> {
  async findVendas(
    queryDto: FindVendasQueryDto,
    empresaId: string,
  ): Promise<{ vendas: Vendas[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { cliente, dataVenda } = queryDto;
    const query = this.createQueryBuilder('vendas');

    query.andWhere('vendas.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (cliente) {
      query.andWhere('vendas.cliente ILIKE :cliente', {
        cliente: `%${cliente}%`,
      });
    }

    // fazer pesquisa pela data da venda

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['vendas.id', 'vendas.nome']);

    const [vendas, total] = await query.getManyAndCount();

    return { vendas, total };
  }

  async createVenda(createVendaDto: CreateVendaDto): Promise<Vendas> {
    const { cliente, produtos, servicos, dataVenda, pagamento, empresa } =
      createVendaDto;

    const venda = this.create();
    venda.cliente = cliente;
    venda.produtos = produtos;
    venda.servicos = servicos;
    venda.dataVenda = dataVenda;
    venda.pagamento = pagamento;
    venda.empresa = empresa;

    try {
      return await venda.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
