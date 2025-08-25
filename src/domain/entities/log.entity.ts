export enum LogSeverityLevel {
	low = "low",
	medium = "medium",
	high = "high",
}

interface LogEntityOptions {
	message: string;
	level: LogSeverityLevel;
	createdAt?: Date;
	origin: string;
}

export class LogEntity {
	public level: LogSeverityLevel;
	public message: string;
	public createdAt: Date;
	public origin: string;

	constructor({ level, message, origin }: LogEntityOptions) {
		this.message = message;
		this.level = level;
		this.createdAt = new Date();
		this.origin = origin;
	}

	static fromJson = (json: string): LogEntity => {
		const {
			message,
			level,
			createdAt = new Date(),
			origin,
		} = JSON.parse(json) as LogEntityOptions;

		const log = new LogEntity({
			level,
			message,
			createdAt,
			origin,
		});
		return log;
	};
}
