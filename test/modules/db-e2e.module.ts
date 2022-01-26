import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      logging: false,
      autoLoadEntities: true,
      entities: ['src/**/*.entity.ts'],
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbE2eModule {}
