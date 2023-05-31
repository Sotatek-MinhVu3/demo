import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(data: any) {
    // console.log({
    //   email: data.email,
    //   price: data.price,
    //   time: data.time
    // })
    await this.mailerService.sendMail({
      to: data.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App!',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: data.email,
        stripeId: data.stripeId,
        price: data.price,
        status: data.status,
        time: data.time,
      },
    });
  }
}
