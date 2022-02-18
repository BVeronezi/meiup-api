import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosPromocaoController } from './produtos_promocao.controller';
import { ProdutosPromocaoRepository } from './produtos_promocao.repository';
import { ProdutosPromocaoService } from './produtos_promocao.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutosPromocaoRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProdutosPromocaoController],
  providers: [ProdutosPromocaoService],
  exports: [ProdutosPromocaoService],
})
export class ProdutosPromocaoModule {}
