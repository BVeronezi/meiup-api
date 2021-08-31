import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoController } from './endereco.controller';
import { EnderecoRepository } from './endereco.repository';
import { EnderecoService } from './endereco.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnderecoRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [EnderecoController],
  providers: [EnderecoService],
  exports: [EnderecoService],
})
export class EnderecoModule {}
