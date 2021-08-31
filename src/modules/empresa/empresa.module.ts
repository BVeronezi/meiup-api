import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoModule } from '../endereco/endereco.module';
import { EmpresaController } from './empresa.controller';
import { EmpresaRepository } from './empresa.repository';
import { EmpresaService } from './empresa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpresaRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnderecoModule,
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService],
})
export class EmpresaModule {}
