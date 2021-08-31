import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

const database = registerAs('database', () => {
  return {
    type: 'postgres',
    logging: true,
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development' ? 'advanced-console' : null,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migration/*.js'],
    cli: {
      migrationsDir: 'migration',
    },
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  } as ConnectionOptions;
});

export default database;
