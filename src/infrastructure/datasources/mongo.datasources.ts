import { LogModel } from "../../data/mongo";
import type { LogDatasource } from "../../domain/datasources/log.datasource";
import {
  LogEntity,
  type LogSeverityLevel,
} from "../../domain/entities/log.entity";

export class MongoDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await LogModel.create(log);
    console.log("log created", newLog.id);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await LogModel.find({ level: severityLevel });
    return logs.map(LogEntity.fromObject);
  }
}
