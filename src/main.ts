import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { setupApp, setupSwagger } from './config/app.config';
import { winstonConfig } from './config/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, { logger });

  setupApp(app);
  setupSwagger(app);

  await app.listen(process.env.PORT || 8000);
}

bootstrap();
