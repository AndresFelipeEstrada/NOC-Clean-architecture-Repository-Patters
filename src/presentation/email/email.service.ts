import { Transporter } from "nodemailer";

export type Attachment = {
  fileName: string;
  path: string;
};

export interface sendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export class EmailService {
  constructor(private readonly transporter: Transporter) {}

  async sendEmail({
    to,
    subject,
    htmlBody,
    attachments = [],
  }: sendEmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = "Logs del servidor";
    const htmlBody = `<h1>Logs del sistema NOC</h1/>
<p>texto de prueba</p>`;
    const attachments: Attachment[] = [
      { fileName: "logs-all.log", path: "./logs/logs-all.log" },
      { fileName: "logs-medium.log", path: "./logs/logs-medium.log" },
      { fileName: "logs-high.log", path: "./logs/logs-high.log" },
    ];

    return await this.sendEmail({ to, subject, htmlBody, attachments });
  }
}
