import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosVendaController } from './produtos_venda.controller';
import { ProdutosVendaRepository } from './produtos_venda.repository';
import { ProdutosVendaService } from './produtos_venda.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutosVendaRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProdutosVendaController],
  providers: [ProdutosVendaService],
  exports: [ProdutosVendaService],
})
export class ProdutosVendaModule {}
