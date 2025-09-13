import { envs } from "../../config/plugins/envs.plugin";
import nodemailer from "nodemailer";
import { EmailService, sendEmailOptions } from "./email.service";

describe("email.service.ts", () => {
  let emailService: EmailService;
  const mockSendmail = jest.fn();

  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendmail,
  });

  const transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new EmailService(transporter);
  });

  it("should send email", async () => {
    const options: sendEmailOptions = {
      htmlBody: "<h1>test</h1>",
      subject: "testing",
      to: "test@gmail.com",
    };

    await emailService.sendEmail(options);

    expect(mockSendmail).toHaveBeenCalled();
    expect(mockSendmail).toHaveBeenCalledTimes(1);
    expect(mockSendmail).toHaveBeenCalledWith({
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
      attachments: [],
    });
  });

  it("should send email with attachments", async () => {
    const email1 = "test@gmail.com";
    const email2 = "test2@gmail.com";

    await emailService.sendEmailWithFileSystemLogs([email1, email2]);

    expect(mockSendmail).toHaveBeenCalled();
    expect(mockSendmail).toHaveBeenCalledTimes(1);
    expect(mockSendmail).toHaveBeenCalledWith({
      to: [email1, email2],
      subject: "Logs del servidor",
      html: expect.any(String),
      attachments: expect.arrayContaining([
        { fileName: "logs-all.log", path: "./logs/logs-all.log" },
        { fileName: "logs-medium.log", path: "./logs/logs-medium.log" },
        { fileName: "logs-high.log", path: "./logs/logs-high.log" },
      ]),
    });
  });
});
