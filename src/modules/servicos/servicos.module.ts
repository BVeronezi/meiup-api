import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicosController } from './servicos.controller';
import { ServicosRepository } from './servicos.repository';
import { ServicosService } from './servicos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicosRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ServicosController],
  providers: [ServicosService],
  exports: [ServicosService],
})
export class ServicosModule {}
