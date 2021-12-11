import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from '../produtos/produtos.module';
import { ProdutosServicoModule } from '../produtos_servico/produtos_servico.module';
import { ServicosController } from './servicos.controller';
import { ServicosRepository } from './servicos.repository';
import { ServicosService } from './servicos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicosRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProdutosServicoModule,
    ProdutosModule,
  ],
  controllers: [ServicosController],
  providers: [ServicosService],
  exports: [ServicosService],
})
export class ServicosModule {}
