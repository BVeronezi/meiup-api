import { Global, Module } from '@nestjs/common';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MailerMailService } from './mailer-mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_SMTP_HOST'),
          port: config.get('EMAIL_SMTP_PORT'),
          secure: true,
          logger: process.env.NODE_ENV === 'development',
          debug: process.env.NODE_ENV === 'development',
          auth: {
            type: 'login',
            user: config.get('EMAIL_SMTP_USERNAME'),
            pass: config.get('EMAIL_SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('EMAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'mail', 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerMailService],
  exports: [MailerMailService],
})
export class MailModule {}
