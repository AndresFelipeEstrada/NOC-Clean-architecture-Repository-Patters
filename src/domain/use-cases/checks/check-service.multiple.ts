import { SeverityLevel } from "@prisma/client";
import { LogEntity } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";

interface CheckServiceMultipleUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccesCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckServiceMuliple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepository: LogRepository[],
    private readonly succesCallback: SuccesCallback,
    private readonly errorCallback: ErrorCallback,
  ) { }

  private callLogs(log: LogEntity) {
    this.logRepository.forEach((logRepository) => {
      logRepository.saveLog(log);
    });
  }

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);

      if (!req.ok) {
        throw new Error(`Erorr on check service ${url}`);
      }

      const log = new LogEntity({
        level: SeverityLevel.LOW,
        message: `Service ${url} working`,
        origin: "check-service.ts",
      });

      this.callLogs(log);
      this.succesCallback();

      return true;
    } catch (error) {
      const errorMessage = `${error}`;

      const log = new LogEntity({
        level: SeverityLevel.HIGH,
        message: errorMessage,
        origin: "check-service.ts",
      });

      this.callLogs(log);
      this.errorCallback(errorMessage);

      return false;
    }
  }
}
