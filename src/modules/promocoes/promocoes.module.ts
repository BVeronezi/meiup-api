import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from '../categorias/categorias.module';
import { PrecosModule } from '../precos/precos.module';
import { PromocoesController } from './promocoes.controller';
import { PromocoesRepository } from './promocoes.repository';
import { PromocoesService } from './promocoes.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([PromocoesRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategoriasModule,
    PrecosModule,
  ],
  controllers: [PromocoesController],
  providers: [PromocoesService],
  exports: [PromocoesService],
})
export class PromocoesModule {}
