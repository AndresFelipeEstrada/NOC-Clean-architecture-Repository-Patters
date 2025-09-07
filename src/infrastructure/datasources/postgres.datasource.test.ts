import { PrismaClient, SeverityLevel } from "@prisma/client";
import { PostgresDatasource } from "./postgres.datasource";
import { envs } from "../../config/plugins/envs.plugin";
import { LogEntity } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient({
  datasourceUrl: envs.POSTGRES_URL,
});

describe("postgres.datasource.ts", () => {
  const logEntity = new LogEntity({
    level: SeverityLevel.LOW,
    message: "test-postgres.datasource.ts",
    origin: "postgres.datasource.ts",
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await prismaClient.logModel.deleteMany();
  });

  it("should create a log in the postgres database", async () => {
    const logSpy = jest.spyOn(console, "log");

    await new PostgresDatasource().saveLog(logEntity);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "log created",
      expect.objectContaining({ ...logEntity, createdAt: expect.any(Date) }),
    );
  });

  it("should return all logs", async () => {
    const postgresDatasource = new PostgresDatasource();
    await postgresDatasource.saveLog(logEntity);
    await postgresDatasource.saveLog(logEntity);

    const allLogs = await postgresDatasource.getLogs(SeverityLevel.LOW);

    allLogs.forEach((log: LogEntity) => {
      expect(log).toBeInstanceOf(LogEntity);
      expect(log.level).toBe(SeverityLevel.LOW);
    });
  });

  it("should return an empty array if no logs match severity", async () => {
    const allLogs = await new PostgresDatasource().getLogs(SeverityLevel.HIGH);
    expect(allLogs).toEqual([]);
  });

  it("should save logs with different levels and return only one", async () => {
    const postgresDatasource = new PostgresDatasource();
    await postgresDatasource.saveLog({
      ...logEntity,
      level: SeverityLevel.LOW,
    });
    await postgresDatasource.saveLog({
      ...logEntity,
      level: SeverityLevel.HIGH,
    });

    const result = await postgresDatasource.getLogs(SeverityLevel.HIGH);
    expect(result).toHaveLength(1);
    expect(result[0].level).toBe(SeverityLevel.HIGH);
  });
});
