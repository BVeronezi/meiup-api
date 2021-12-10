import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaController } from './agenda.controller';
import { AgendaRepository } from './agenda.repository';
import { AgendaService } from './agenda.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([AgendaRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
