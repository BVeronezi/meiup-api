import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { mailerConfig } from './config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './modules/auth/auth.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './config/database.config';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { PrecosModule } from './modules/precos/precos.module';
import { EnderecoModule } from './modules/endereco/endereco.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { FornecedoresModule } from './modules/fornecedores/fornecedores.module';
import { ServicosModule } from './modules/servicos/servicos.module';
import { VendasModule } from './modules/vendas/vendas.module';
import { PromocoesModule } from './modules/promocoes/promocoes.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { ProdutosVendaModule } from './modules/produtos_venda/produtos_venda.module';
import { ProdutosServicoModule } from './modules/produtos_servico/produtos_servico.module';
import { ServicosVendaModule } from './modules/servicos_venda/servicos_venda.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
      expandVariables: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRoot(mailerConfig),
    UsuarioModule,
    AuthModule,
    EmpresaModule,
    EnderecoModule,
    ProdutosModule,
    CategoriasModule,
    PrecosModule,
    ClientesModule,
    FornecedoresModule,
    ServicosModule,
    VendasModule,
    PromocoesModule,
    AgendaModule,
    ProdutosVendaModule,
    ProdutosServicoModule,
    ServicosVendaModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
