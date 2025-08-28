import { SeverityLevel } from "@prisma/client";
import type { EmailService } from "../../../presentation/email/email.service";
import { LogEntity } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";

interface SendLogsEmailUseCase {
	execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendLogsEmailUseCase {
	constructor(
		private readonly emailService: EmailService,
		private readonly logRepository: LogRepository,
	) {}

	async execute(to: string | string[]) {
		try {
			const send = await this.emailService.sendEmailWithFileSystemLogs(to);
			if (!send) {
				throw new Error("Email log was not send");
			}

			const log = new LogEntity({
				level: SeverityLevel.LOW,
				message: "Log email sent",
				origin: "send-email-logs.ts",
			});

			this.logRepository.saveLog(log);
			return true;
		} catch (error) {
			const log = new LogEntity({
				level: SeverityLevel.HIGH,
				message: `${error}`,
				origin: "send-email-logs.ts",
			});

			this.logRepository.saveLog(log);

			return false;
		}
	}
}
