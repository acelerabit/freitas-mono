import { EMAIL_QUEUE } from '@/common/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import 'dotenv/config';

@Processor(EMAIL_QUEUE)
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(
    job: Job<{
      email: string;
      subject: string;
      text: string;
      template: string;
      context: any;
    }>,
  ) {
    const { email, subject, text, template, context } = job.data;

    await this.mailService.sendMail({
      to: email,
      from: process.env.SMTP_USER,
      subject,
      text,
      template,
      context,
    });
  }
}

export { SendMailConsumer };
