import { MailerService } from '@nestjs-modules/mailer';
import { createMock } from '@golevelup/ts-jest';
import { MailerMailService } from './mailer-mail.service';

export type EmailOptions = {
  to?: string;
  from?: string;
  subject?: string;
  template?: string;
  context?: any;
};

describe('Mailer Service', () => {
  let mailerService: MailerService;
  let service: MailerMailService;
  beforeEach(async () => {
    mailerService = createMock<MailerService>();
    service = new MailerMailService(mailerService);
  });
  beforeEach(async () => {
    jest.spyOn(mailerService, 'sendMail').mockResolvedValue(null);
  });
  it('Deve chamar o MailerService', async () => {
    await service.send(createMock<EmailOptions>());
    expect(mailerService.sendMail).toBeCalled();
  });
});
