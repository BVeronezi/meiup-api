import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoModule } from '../endereco/endereco.module';
import { UsuariosController } from './usuario.controller';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnderecoModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
