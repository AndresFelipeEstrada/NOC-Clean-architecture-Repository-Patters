import type { SeverityLevel } from "@prisma/client";
import { LogModel } from "../../data/mongo";
import type { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity } from "../../domain/entities/log.entity";

export class MongoDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await LogModel.create(log);
    console.log("log created", newLog.id);
  }

  async getLogs(severityLevel: SeverityLevel): Promise<LogEntity[]> {
    const logs = await LogModel.find({ level: severityLevel });
    return logs.map(LogEntity.fromObject);
  }
}
