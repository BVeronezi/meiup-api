import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicosPromocaoController } from './servicos_promocao.controller';
import { ServicosPromocaoRepository } from './servicos_promocao.repository';
import { ServicosPromocaoService } from './servicos_promocao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicosPromocaoRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ServicosPromocaoController],
  providers: [ServicosPromocaoService],
  exports: [ServicosPromocaoService],
})
export class ServicosPromocaoModule {}
