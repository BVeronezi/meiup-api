import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosFornecedoresController } from './produtos_fornecedores.controller';
import { ProdutosFornecedoresRepository } from './produtos_fornecedores.repository';
import { ProdutosFornecedoresService } from './produtos_fornecedores.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutosFornecedoresRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProdutosFornecedoresController],
  providers: [ProdutosFornecedoresService],
  exports: [ProdutosFornecedoresService],
})
export class ProdutosFornecedoresModule {}
