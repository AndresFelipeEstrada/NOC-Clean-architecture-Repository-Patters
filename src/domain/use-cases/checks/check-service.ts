import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
	execute(url: string): Promise<boolean>;
}

type SuccesCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
	constructor(
		private readonly logRepository: LogRepository,
		private readonly succesCallback: SuccesCallback,
		private readonly errorCallback: ErrorCallback,
	) {}

	public async execute(url: string): Promise<boolean> {
		try {
			const req = await fetch(url);

			if (!req.ok) {
				throw new Error(`Erorr on check service ${url}`);
			}

			const log = new LogEntity({
				level: LogSeverityLevel.low,
				message: `Service ${url} working`,
				origin: "check-service.ts",
			});

			this.logRepository.saveLog(log);
			this.succesCallback();

			return true;
		} catch (error) {
			const errorMessage = `${error}`;

			const log = new LogEntity({
				level: LogSeverityLevel.high,
				message: errorMessage,
				origin: "check-service.ts",
			});

			this.logRepository.saveLog(log);
			this.errorCallback(errorMessage);

			return false;
		}
	}
}
