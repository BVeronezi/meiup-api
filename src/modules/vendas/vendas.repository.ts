import { EntityRepository, getManager, Repository } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Usuario } from '../usuario/usuario.entity';
import { CreateVendaDto } from './dto/create-venda-dto';
import { FindVendasQueryDto } from './dto/find-vendas-query-dto';
import { Vendas } from './vendas.entity';

@EntityRepository(Vendas)
export class VendasRepository extends Repository<Vendas> {
  async findVendas(
    queryDto: FindVendasQueryDto,
    empresaId: string,
  ): Promise<{ vendas: Vendas[]; total: number; totais?: any[] }> {
    const entityManager = getManager();
    const totais = [];

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

    if (queryDto.dataInicio) {
      query.andWhere(
        `vendas.dataVenda between '${queryDto.dataInicio}' and '${queryDto.dataFim}'`,
      );
    }

    query.leftJoin('vendas.cliente', 'cliente');
    query.leftJoin('vendas.usuario', 'usuario');
    query.select([
      'vendas.id',
      'cliente',
      'usuario.nome',
      'vendas.dataVenda',
      'vendas.valorTotal',
      'vendas.status',
    ]);

    if (cliente) {
      query.andWhere('cliente.nome ILIKE :nome', { nome: `%${cliente}%` });
    }

    if (queryDto.relatorio) {
      query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : `"dataVenda"`);
    } else {
      query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    }

    const [vendas, total] = await query.getManyAndCount();

    if (queryDto.relatorio) {
      const totalPorStatus = await entityManager.query(`
      select
        status,
        case
          when (status) = 0 then sum("valorTotal")
          when (status) = 1 then sum("valorTotal")
          when (status) = 2 then sum("valorTotal")
        end as totais
      from
        vendas
      where
        "empresaId" = ${empresaId}
      and "dataVenda" between '${queryDto.dataInicio}' and '${queryDto.dataFim}'
      group by
        status   
      `);

      const total = await entityManager.query(`
      select
        SUM("valorTotal") as "Total"
      from
        vendas
      where
         "empresaId" = ${empresaId}    
       and "dataVenda" between '${queryDto.dataInicio}' and '${queryDto.dataFim}' 
      `);

      totais.push({
        totalEmAberto: totalPorStatus[0]?.totais,
        totalFinalizadas: totalPorStatus[1]?.totais,
        totalCanceladas: totalPorStatus[2]?.totais,
        total: total[0]?.Total,
      });
    }

    return { vendas, total, totais };
  }

  async createVenda(
    createVendaDto: CreateVendaDto,
    usuario: Usuario,
    empresa: Empresa,
  ): Promise<Vendas> {
    const { cliente, dataVenda, valorTotal, pagamento, valorTroco } =
      createVendaDto;

    const venda = this.create();
    venda.cliente = cliente;
    venda.dataVenda = dataVenda;
    venda.valorTotal = valorTotal ? Number(valorTotal) : 0;
    venda.pagamento = pagamento ? Number(pagamento) : 0;
    venda.valorTroco = valorTroco ? Number(valorTroco) : 0;
    venda.empresa = empresa;
    venda.usuario = usuario;

    try {
      return await venda.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
