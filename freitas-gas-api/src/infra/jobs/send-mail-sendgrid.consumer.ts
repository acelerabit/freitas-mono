import { Process, Processor } from '@nestjs/bull';
import { MailDataRequired } from '@sendgrid/mail';
import { Job } from 'bull';
import 'dotenv/config';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { EMAIL_QUEUE } from 'src/common/constants';
import { SendGridClient } from '../email/sendgrid/send-grid.client';

@Processor(EMAIL_QUEUE)
export class SendMailConsumerSendGrid {
  constructor(private readonly sendGridClient: SendGridClient) {}

  @Process('sendMail-job')
  async sendMailJob(
    job: Job<{
      email: string;
      subject: string;
      text: string;
      templateName?: string;
      context?: any;
    }>,
  ) {
    const { email, subject, text, templateName, context } = job.data;

    if (templateName) {
      try {
        const templatePath = path.join(
          __dirname,
          '..',
          '..',
          'infra',
          'email',
          'templates',
          templateName,
        );

        console.log(templatePath);

        const templateSource = fs.readFileSync(templatePath, 'utf8');

        const template = Handlebars.compile(templateSource);

        const htmlContent = template(context);

        const mail: MailDataRequired = {
          to: email,
          from: process.env.SMTP_FROM, //Approved sender ID in Sendgrid
          subject,
          html: htmlContent,
        };

        await this.sendGridClient.send(mail);
      } catch (err) {
        console.log(err);
      }

      return;
    } else {
      try {
        const mail: MailDataRequired = {
          to: email,
          from: process.env.SMTP_FROM, //Approved sender ID in Sendgrid
          subject,
          content: [{ type: 'text/plain', value: text }],
        };
        await this.sendGridClient.send(mail);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
