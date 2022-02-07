import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosServicoController } from './produtos_servico.controller';
import { ProdutosServicoRepository } from './produtos_servico.repository';
import { ProdutosServicoService } from './produtos_servico.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutosServicoRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProdutosServicoController],
  providers: [ProdutosServicoService],
  exports: [ProdutosServicoService],
})
export class ProdutosServicoModule {}
