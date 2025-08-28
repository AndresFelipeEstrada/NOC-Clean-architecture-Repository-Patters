import { PrismaClient, type SeverityLevel } from "@prisma/client";
import { envs } from "../../config/plugins/envs.plugin";
import type { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient({
	datasourceUrl: envs.POSTGRES_URL,
});

export class PostgresDatasource implements LogDatasource {
	async saveLog(log: LogEntity): Promise<void> {
		const newLog = await prismaClient.logModel.create({
			data: {
				level: log.level,
				message: log.message,
				origin: log.origin,
			},
		});
		console.log("log created", newLog);
	}

	async getLogs(severityLevel: SeverityLevel): Promise<LogEntity[]> {
		const logs = await prismaClient.logModel.findMany({
			where: { level: severityLevel },
		});
		return logs.map(LogEntity.fromObject);
	}
}
