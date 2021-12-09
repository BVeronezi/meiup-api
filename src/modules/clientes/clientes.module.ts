import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoModule } from '../endereco/endereco.module';
import { ClientesController } from './clientes.controller';
import { ClientesRepository } from './clientes.repository';
import { ClientesService } from './clientes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientesRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnderecoModule,
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
