import fs from "node:fs";
import type { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasource implements LogDatasource {
	private readonly logPath = "logs/";
	private readonly allLogsPath = "logs/logs-all.log";
	private readonly mediumLogsPath = "logs/logs-medium.log";
	private readonly highLogsPath = "logs/logs-high.log";

	constructor() {
		this.createLogsFile();
	}

	private createLogsFile = () => {
		if (!fs.existsSync(this.logPath)) {
			fs.mkdirSync(this.logPath, { recursive: true });
		}

		const allPaths = [this.allLogsPath, this.mediumLogsPath, this.highLogsPath];

		allPaths.forEach((path) => {
			if (!fs.existsSync(path)) {
				fs.writeFileSync(path, "");
			}
		});
	};

	async saveLog(newLog: LogEntity): Promise<void> {
		const logAsJson = `${JSON.stringify(newLog)}\n`;
		fs.appendFileSync(this.allLogsPath, logAsJson);

		switch (newLog.level) {
			case LogSeverityLevel.medium:
				fs.appendFileSync(this.mediumLogsPath, logAsJson);
				break;

			case LogSeverityLevel.high:
				fs.appendFileSync(this.highLogsPath, logAsJson);
				break;
		}
	}

	private getLogsFromfile = (path: string): LogEntity[] => {
		const content = fs.readFileSync(path, "utf8");
		return content
			.split("\n")
			.filter((line) => line.trim().length > 0)
			.map(LogEntity.fromJson);
	};

	async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
		switch (severityLevel) {
			case LogSeverityLevel.low:
				return this.getLogsFromfile(this.allLogsPath);
			case LogSeverityLevel.medium:
				return this.getLogsFromfile(this.mediumLogsPath);
			case LogSeverityLevel.high:
				return this.getLogsFromfile(this.highLogsPath);

			default:
				throw new Error(`${severityLevel} not implemented`);
		}
	}
}
