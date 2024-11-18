import { Injectable } from '@nestjs/common';
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail';
// import 'dotenv/client';

@Injectable()
export class SendGridClient {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
    } catch (error) {
      throw error;
    }
  }
}
