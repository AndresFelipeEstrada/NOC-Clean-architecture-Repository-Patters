import type { LogDatasource } from "../../domain/datasources/log.datasource";
import type {
	LogEntity,
	LogSeverityLevel,
} from "../../domain/entities/log.entity";

export class MongoDatasource implements LogDatasource {
	saveLog(log: LogEntity): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
		throw new Error("Method not implemented.");
	}
}
