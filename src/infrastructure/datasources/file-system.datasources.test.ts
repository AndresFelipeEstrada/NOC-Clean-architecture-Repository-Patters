import fs from "node:fs";
import path from "node:path";
import { FileSystemDatasource } from "./file-system.datasources";
import { LogEntity } from "../../domain/entities/log.entity";
import { SeverityLevel } from "@prisma/client";

describe("file-system.datasources.ts", () => {
  const logPath = path.join(__dirname, "../../../logs");
  let logDatasource: FileSystemDatasource;

  const baseLog = new LogEntity({
    message: "test for file-system",
    level: SeverityLevel.LOW,
    origin: "file-system.datasource.test.ts",
  });

  beforeEach(() => {
    if (fs.existsSync(logPath)) {
      fs.rmSync(logPath, { recursive: true, force: true });
    }
    logDatasource = new FileSystemDatasource();
  });

  it("should create log files if they do not exists", () => {
    new FileSystemDatasource();
    const files = fs.readdirSync(logPath);

    expect(files).toEqual(["logs-all.log", "logs-high.log", "logs-medium.log"]);
  });

  const cases = [
    { level: SeverityLevel.LOW, file: "logs-all.log" },
    { level: SeverityLevel.MEDIUM, file: "logs-medium.log" },
    { level: SeverityLevel.HIGH, file: "logs-high.log" },
  ];

  it.each(cases)("should save a log in %s", ({ level, file }) => {
    const logSaved = new LogEntity({ ...baseLog, level });
    logDatasource.saveLog(logSaved);

    const allLogs = fs.readFileSync(`${logPath}/${file}`, "utf8");
    expect(allLogs).toContain(JSON.stringify(logSaved));
  });

  it.each(cases)("should return all logs in %s", async ({ level }) => {
    const logSaved = new LogEntity({ ...baseLog, level });

    await logDatasource.saveLog(logSaved);

    const allLogs = await logDatasource.getLogs(level);

    expect(allLogs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "test for file-system",
          level,
          origin: "file-system.datasource.test.ts",
        }),
      ]),
    );
  });

  it("should return multiple logs", async () => {
    const log1 = new LogEntity({
      ...baseLog,
      level: SeverityLevel.HIGH,
      message: "first",
    });
    const log2 = new LogEntity({
      ...baseLog,
      level: SeverityLevel.HIGH,
      message: "second",
    });
    const log3 = new LogEntity({
      ...baseLog,
      level: SeverityLevel.HIGH,
      message: "third",
    });

    await logDatasource.saveLog(log1);
    await logDatasource.saveLog(log2);
    await logDatasource.saveLog(log3);

    const logs = await logDatasource.getLogs(SeverityLevel.HIGH);

    expect(logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "first" }),
        expect.objectContaining({ message: "second" }),
        expect.objectContaining({ message: "third" }),
      ]),
    );
  });
});
