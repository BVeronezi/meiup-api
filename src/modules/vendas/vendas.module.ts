import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from '../produtos/produtos.module';
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
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
