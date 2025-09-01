import { SeverityLevel } from "@prisma/client";
import { LogEntity } from "../entities/log.entity";
import type { LogDatasource } from "./log.datasource";

describe("log.datasource.ts", () => {
  const newLog = new LogEntity({
    origin: "log.datasource.test.ts",
    level: SeverityLevel.HIGH,
    message: "test-message",
  });

  class MockLogDatasource implements LogDatasource {
    async saveLog(_log: LogEntity): Promise<void> { }

    async getLogs(_severityLevel: SeverityLevel): Promise<LogEntity[]> {
      return [newLog];
    }
  }

  it("should test the abstract class", async () => {
    const mockLogDatasource = new MockLogDatasource();

    expect(mockLogDatasource).toBeInstanceOf(MockLogDatasource);
    expect(mockLogDatasource).toHaveProperty("saveLog");
    expect(mockLogDatasource).toHaveProperty("getLogs");

    await mockLogDatasource.saveLog(newLog)
    const logs = await mockLogDatasource.getLogs(SeverityLevel.HIGH)

    expect(logs).toHaveLength(1)
    expect(logs[0]).toEqual(newLog)
    expect(logs[0]).toBeInstanceOf(LogEntity)
  });
});
