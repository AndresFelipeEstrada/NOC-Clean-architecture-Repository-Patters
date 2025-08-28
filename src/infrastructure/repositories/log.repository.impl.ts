import type { SeverityLevel } from "@prisma/client";
import type { LogDatasource } from "../../domain/datasources/log.datasource";
import type { LogEntity } from "../../domain/entities/log.entity";
import type { LogRepository } from "../../domain/repository/log.repository";

export class LogRepositoryImpl implements LogRepository {
	constructor(private readonly logDatasource: LogDatasource) {}

	async saveLog(log: LogEntity): Promise<void> {
		return this.logDatasource.saveLog(log);
	}

	async getLogs(severityLevel: SeverityLevel): Promise<LogEntity[]> {
		return this.logDatasource.getLogs(severityLevel);
	}
}
