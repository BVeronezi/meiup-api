import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupApp(app: INestApplication): INestApplication {
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  return app;
}

export function setupSwagger(app: INestApplication): INestApplication {
  const config = new DocumentBuilder()
    .setTitle('MEIUP API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  return app;
}
