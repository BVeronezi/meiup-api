import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from '../clientes/clientes.module';
import { ProdutosModule } from '../produtos/produtos.module';
import { ProdutosServicoModule } from '../produtos_servico/produtos_servico.module';
import { ProdutosVendaModule } from '../produtos_venda/produtos_venda.module';
import { ServicosModule } from '../servicos/servicos.module';
import { ServicosVendaModule } from '../servicos_venda/servicos_venda.module';
import { VendasController } from './vendas.controller';
import { VendasRepository } from './vendas.repository';
import { VendasService } from './vendas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendasRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ServicosModule,
    ProdutosModule,
    ClientesModule,
    ProdutosVendaModule,
    ProdutosServicoModule,
    ServicosVendaModule,
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
