import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from '../produtos/produtos.module';
import { ProdutosServicoModule } from '../produtos_servico/produtos_servico.module';
import { ServicosVendaController } from './servicos_venda.controller';
import { ServicosVendaRepository } from './servicos_venda.repository';
import { ServicosVendaService } from './servicos_venda.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicosVendaRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProdutosServicoModule,
    ProdutosModule,
  ],
  controllers: [ServicosVendaController],
  providers: [ServicosVendaService],
  exports: [ServicosVendaService],
})
export class ServicosVendaModule {}
