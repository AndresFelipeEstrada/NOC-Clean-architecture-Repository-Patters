import type { SeverityLevel } from "@prisma/client";


interface LogEntityOptions {
	message: string;
	level: SeverityLevel;
	createdAt?: Date;
	origin: string;
}

export class LogEntity {
	public level: SeverityLevel;
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

	static fromObject = (object: { [key: string]: any }): LogEntity => {
		const { message, level, createdAt, origin } = object;

		return new LogEntity({ message, level, createdAt, origin });
	};
}
