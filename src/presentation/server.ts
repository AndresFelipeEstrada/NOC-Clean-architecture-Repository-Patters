import { CheckServiceMuliple } from "../domain/use-cases/checks/check-service.multiple";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasources";
import { MongoDatasource } from "../infrastructure/datasources/mongo.datasources";
import { PostgresDatasource } from "../infrastructure/datasources/postgres.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";

const fsLogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const mongoLogRepository = new LogRepositoryImpl(new MongoDatasource());
const postgresLogRepository = new LogRepositoryImpl(new PostgresDatasource());

export class Server {
  public static async start() {
    console.log("Server started...");

    // new SendEmailLogs(emailService, logRepository).execute([
    //   "andresfe1396@gmail.com",
    // ]);
    CronService.createJob("*/5 * * * * *", () => {
      const url = "https://google.com";
      new CheckServiceMuliple(
        [fsLogRepository, mongoLogRepository, postgresLogRepository],
        () => console.log(`${url} is ok`),
        (error) => console.log(error),
      ).execute(url);
    });
  }
}
