import { SendEmailLogs } from "../domain/use-cases/emails/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { EmailService } from "./email/email.service";

const emailService = new EmailService();
const fileSystemLogRepository = new LogRepositoryImpl(
	new FileSystemDatasource(),
);

export class Server {
	public static async start() {
		console.log("Server started...");
		new SendEmailLogs(emailService, fileSystemLogRepository).execute([
			"andresfe1396@gmail.com",
		]);


		// });
		//
		// CronService.createJob("*/2 * * * * *", () => {
		// 	const url = "https://google.com";
		// 	new CheckService(
		// 		fileSystemLogRepository,
		// 		() => console.log(`${url} is ok`),
		// 		(error) => console.log(error),
		// 	).execute(url);
		// });
	}
}
