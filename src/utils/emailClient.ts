// TODO: not yet connected nor used nor tested
import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';

// to use GMAIL, remeber to enable "less secure apps" on the google account dashboard
const defaultConfig = {
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  fromEmail: process.env.NODEMAILER_FROM || process.env.NODEMAILER_USER,
};

export default class EmailClient {
  private client: Transporter;
  private fromEmail: string;

  constructor(configuration = defaultConfig) {
    this.client = createTransport(configuration);
    this.fromEmail = configuration.fromEmail;
  }

  public async sendLoginEmail(content, to) {
    try {
      const sentMessage: SentMessageInfo = await this.client.sendMail(
        { to, from: this.fromEmail, subject: content.subject, html: content.html },
      );
      console.log(sentMessage);
      return sentMessage;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
