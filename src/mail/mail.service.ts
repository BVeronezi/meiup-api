export type EmailOptions = {
  to?: string;
  from?: string;
  subject?: string;
  template?: string;
  context?: any;
};

export interface ISendEmailService {
  send(options: EmailOptions): Promise<void>;
}

export class EMailSendError extends Error {
  code = 500;
  message = 'Erro ao enviar e-mail';
}
