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
    const { cliente } = queryDto;
    const query = this.createQueryBuilder('vendas');

    query.andWhere('vendas.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (queryDto.limit) {
      query.take(+queryDto.limit);
    }

    if (queryDto.page) {
      query.skip((Number(queryDto.page) - 1) * queryDto.limit ?? 10);
    }

    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.leftJoin('vendas.cliente', 'cliente');
    query.select([
      'vendas.id',
      'cliente',
      'vendas.dataVenda',
      'vendas.valorTotal',
      'vendas.status',
    ]);

    if (cliente) {
      query.andWhere('cliente.nome ILIKE :nome', { nome: `%${cliente}%` });
    }

    const [vendas, total] = await query.getManyAndCount();

    return { vendas, total };
  }

  async createVenda(createVendaDto: CreateVendaDto): Promise<Vendas> {
    const {
      cliente,
      dataVenda,
      valorTotal,
      pagamento,
      valorTroco,
      empresa,
      usuario,
    } = createVendaDto;

    const venda = this.create();
    venda.cliente = cliente;
    venda.dataVenda = dataVenda;
    venda.valorTotal = valorTotal;
    venda.pagamento = pagamento;
    venda.troco = valorTroco;
    venda.empresa = empresa;
    venda.usuario = usuario;

    try {
      return await venda.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
