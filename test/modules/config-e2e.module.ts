import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local'],
      expandVariables: true,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigE2eModule {}
