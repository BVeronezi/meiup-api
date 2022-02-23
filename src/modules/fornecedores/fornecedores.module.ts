import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoModule } from '../endereco/endereco.module';
import { ProdutosFornecedoresModule } from '../produtos_fornecedores/produtos_fornecedores.module';
import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresRepository } from './fornecedores.repository';
import { FornecedoresService } from './fornecedores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FornecedoresRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnderecoModule,
    ProdutosFornecedoresModule,
  ],
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
  exports: [FornecedoresService],
})
export class FornecedoresModule {}
