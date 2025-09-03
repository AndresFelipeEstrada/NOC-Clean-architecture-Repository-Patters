import type { EmailService } from "../../../presentation/email/email.service";
import { LogEntity } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";
import { SendEmailLogs } from "./send-email-logs";

describe("send-email-logs.ts", () => {
  const mockEmailService: jest.Mocked<Omit<EmailService, "transporter">> = {
    sendEmail: jest.fn(),
    sendEmailWithFileSystemLogs: jest.fn().mockResolvedValue(true),
  };

  const mockLogRepository: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const sendEmailLogs = new SendEmailLogs(
    mockEmailService as unknown as EmailService,
    mockLogRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call sendEmail and saveLog", async () => {
    const testEmail = "test@gmail.com";
    const result = await sendEmailLogs.execute(testEmail);
    const logCall = (mockLogRepository.saveLog as jest.Mock).mock.calls[0][0];

    expect(result).toBe(true);
    expect(mockLogRepository.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity),
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith({
      level: "LOW",
      message: "Log email sent",
      origin: "send-email-logs.ts",
      createdAt: expect.any(Date),
    });
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      testEmail,
    );
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(
      1,
    );

    expect(logCall).toBeInstanceOf(LogEntity);
    expect(logCall.level).toBe("LOW");
    expect(logCall.message).toBe("Log email sent");
  });

  it("should log in case of error", async () => {
    mockEmailService.sendEmailWithFileSystemLogs.mockResolvedValue(false);
    const result = await sendEmailLogs.execute("");

    expect(result).toBe(false);

    expect(mockLogRepository.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity),
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith({
      level: "HIGH",
      message: "Error: Email log was not send",
      origin: "send-email-logs.ts",
      createdAt: expect.any(Date),
    });
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(
      1,
    );
  });
});
