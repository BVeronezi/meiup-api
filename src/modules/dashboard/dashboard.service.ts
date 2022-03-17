import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class DashboardService {
  async findDados(empresaId: string) {
    const entityManager = getManager();

    const totalProdutos = await entityManager.query(`
    select
        count(*)
    from
        produtos
    where
        "empresaId" = ${empresaId}
    
    `);

    const estoqueMinimo = await entityManager.query(`
    select
        count(*)
    from
        produtos
    where
        estoque < "estoqueMinimo"
        and "empresaId" = ${empresaId}
    `);

    const vendasHoje = await entityManager.query(`
    select
        COUNT(1) as "cnt"
    from
        "vendas" "vendas"
    where
        "vendas"."empresaId" = ${empresaId}
        and "vendas"."dataVenda" = '${moment().format('YYYY-MM-DD')}'   
    `);

    const inicioMesAtual = String(
      moment().startOf('month').format('YYYY-MM-DD'),
    );
    const fimMesAtual = String(moment().endOf('month').format('YYYY-MM-DD'));
    const vendasMesAtual = await entityManager.query(`
    select
        COUNT(1) as "count"
    from
        "vendas" "vendas"
    where
        "vendas"."empresaId" = ${empresaId}
        and "vendas"."dataVenda" between '${inicioMesAtual}' and '${fimMesAtual}'
    `);

    const inicioMesAnterior = moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    const fimMesAnterior = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
    const vendasMesAnterior = await entityManager.query(`
    select
        COUNT(1) as "count"
    from
        "vendas" "vendas"
    where
        "vendas"."empresaId" = ${empresaId}
        and "vendas"."dataVenda" between '${inicioMesAnterior}' and '${fimMesAnterior}'
    `);

    const produtosMaisVendidos = await entityManager.query(`
        SELECT
        "produto"."descricao" as "descricao",
        "produto"."id" as "produto_id", 
        COUNT(*) 
        FROM
        "produtos_venda" "produtos_venda"
        LEFT JOIN "produtos" "produto" on
        "produto"."id" = "produtos_venda"."produtoId"
        WHERE
        "produtos_venda"."empresaId" = ${empresaId}
        GROUP BY
        "produto"."descricao",
        "produto"."id"
        ORDER BY 2 DESC ;
      `);

    const servicosMaisVendidos = await entityManager.query(`
    select
        s.nome as "descricao",
        s.id as "servico_id",
        count(*)
    from
        servicos_venda sv
    left join servicos s on
        s.id = sv."servicoId"
    where
        sv."empresaId" = ${empresaId}
    group by
        s.nome ,
        s.id
    order by
        2 desc
  `);

    const evolucaoVendaMes = await entityManager.query(`
    select
        "dataVenda" ,
        count(*)
    from
        "vendas" "vendas"
    where
        "vendas"."empresaId" =  ${empresaId}
        and "vendas"."dataVenda" between '${inicioMesAtual}' and '${fimMesAtual}'
    group by
        "dataVenda"
    order by 1 asc
    `);

    return {
      totalProdutos,
      estoqueMinimo,
      vendasHoje,
      vendasMesAtual,
      vendasMesAnterior,
      produtosMaisVendidos,
      servicosMaisVendidos,
      evolucaoVendaMes,
    };
  }
}
