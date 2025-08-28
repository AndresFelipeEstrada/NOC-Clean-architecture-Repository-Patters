import { PostgresDatasource } from "../infrastructure/datasources/postgres.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";

// const emailService = new EmailService();
const logRepository = new LogRepositoryImpl(
	//new FileSystemDatasource(),
	// new MongoDatasource(),
	new PostgresDatasource(),
);

export class Server {
	public static async start() {
		console.log("Server started...");

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
