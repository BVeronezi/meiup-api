import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from '../clientes/clientes.module';
import { ProdutosModule } from '../produtos/produtos.module';
import { ProdutosVendaModule } from '../produtos_venda/produtos_venda.module';
import { ServicosModule } from '../servicos/servicos.module';
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
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
