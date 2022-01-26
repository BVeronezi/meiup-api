import { Inject, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { EmailOptions, ISendEmailService } from './mail.service';

@Injectable()
export class MailerMailService implements ISendEmailService {
  constructor(
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  send(options: EmailOptions): Promise<void> {
    return this.mailerService.sendMail(options as ISendMailOptions);
  }
}
