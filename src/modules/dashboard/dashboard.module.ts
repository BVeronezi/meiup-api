import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EnderecoModule } from '../endereco/endereco.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnderecoModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
