import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrecosController } from './precos.controller';
import { PrecosRepository } from './precos.repository';
import { PrecosService } from './precos.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([PrecosRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PrecosController],
  providers: [PrecosService],
  exports: [PrecosService],
})
export class PrecosModule {}
