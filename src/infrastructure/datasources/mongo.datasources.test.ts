import { SeverityLevel } from "@prisma/client";
import { envs } from "../../config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "../../data/mongo";
import { LogEntity } from "../../domain/entities/log.entity";
import { MongoDatasource } from "./mongo.datasources";

describe("mongo.datasources.ts", () => {
  let logDatasource: MongoDatasource;
  const log = new LogEntity({
    level: SeverityLevel.LOW,
    message: "test for mongo.datasources",
    origin: "mongo.datasources.test.ts",
  });

  beforeEach(() => {
    logDatasource = new MongoDatasource();
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  });

  afterEach(async () => {
    await LogModel.deleteMany();
  });

  afterAll(async () => {
    await MongoDatabase.disconnect();
  });

  it("should create a log with MongoDatasource", async () => {
    const logSpy = jest.spyOn(console, "log");

    await logDatasource.saveLog(log);

    expect(logDatasource).toHaveProperty("saveLog");
    expect(logDatasource).toHaveProperty("getLogs");

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("log created", expect.any(String));
  });

  it("should get logs", async () => {
    await logDatasource.saveLog(log);
    await logDatasource.saveLog(log);
    const logs = await logDatasource.getLogs(SeverityLevel.LOW);

    expect(logs.length).toBe(2);
  });

  it("should persist log in database when calling saveLog", async () => {
    await logDatasource.saveLog(log);

    const stored = await LogModel.findOne({ message: log.message });

    expect(stored).not.toBeNull();
    expect(stored?.level).toBe(log.level);
    expect(stored?.origin).toBe(log.origin);
  });

  it("should return an empty array if no logs match severity", async () => {
    const logs = await logDatasource.getLogs(SeverityLevel.HIGH);
    expect(logs).toEqual([]);
  });

  it("should filter logs by severity", async () => {
    await logDatasource.saveLog(
      new LogEntity({ ...log, level: SeverityLevel.LOW }),
    );
    await logDatasource.saveLog(
      new LogEntity({ ...log, level: SeverityLevel.HIGH }),
    );

    const lowLogs = await logDatasource.getLogs(SeverityLevel.LOW);
    const highLogs = await logDatasource.getLogs(SeverityLevel.HIGH);

    expect(lowLogs.every((log) => log.level === SeverityLevel.LOW)).toBe(true);
    expect(highLogs.every((log) => log.level === SeverityLevel.HIGH)).toBe(
      true,
    );
  });
});
