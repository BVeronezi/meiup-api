import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoModule } from '../endereco/endereco.module';
import { FornecedoresController } from './fornecedores.controlller';
import { FornecedoresRepository } from './fornecedores.repository';
import { FornecedoresService } from './fornecedores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FornecedoresRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnderecoModule,
  ],
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
  exports: [FornecedoresService],
})
export class FornecedoresModule {}
