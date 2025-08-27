import { LogSeverityLevel } from "../domain/entities/log.entity";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasources";
import { MongoDatasource } from "../infrastructure/datasources/mongo.datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";

// const emailService = new EmailService();
const logRepository = new LogRepositoryImpl(
	new FileSystemDatasource(),
	// new MongoDatasource(),
);

export class Server {
	public static async start() {
		console.log("Server started...");
		const logs = await logRepository.getLogs(LogSeverityLevel.high);
		console.log("Server#start logs:", logs); 

		// new SendEmailLogs(emailService, logRepository).execute([
		//   "andresfe1396@gmail.com",
		// ]);
		// CronService.createJob("*/5 * * * * *", () => {
		// 	const url = "https://google.com";
		// 	new CheckService(
		// 		logRepository,
		// 		() => console.log(`${url} is ok`),
		// 		(error) => console.log(error),
		// 	).execute(url);
		// });
	}
}
