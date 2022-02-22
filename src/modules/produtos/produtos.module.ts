import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from '../categorias/categorias.module';
import { FornecedoresModule } from '../fornecedores/fornecedores.module';
import { PrecosModule } from '../precos/precos.module';
import { ProdutosPromocaoModule } from '../produtos_promocao/produtos_promocao.module';
import { ProdutosServicoModule } from '../produtos_servico/produtos_servico.module';
import { ProdutosController } from './produtos.controller';
import { ProdutosRepository } from './produtos.repository';
import { ProdutosService } from './produtos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutosRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategoriasModule,
    PrecosModule,
    FornecedoresModule,
    ProdutosServicoModule,
    ProdutosPromocaoModule,
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService],
})
export class ProdutosModule {}
