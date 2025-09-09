import { SeverityLevel } from "@prisma/client";
import { LogEntity } from "../../domain/entities/log.entity";
import { LogRepositoryImpl } from "./log.repository.impl";

describe("log.repository.impl.ts", () => {
  const mockLogDatasource = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const baseLog = new LogEntity({
    level: SeverityLevel.LOW,
    message: "test for log.repository.impl.ts",
    origin: "log.repository.impl.test.ts",
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saveLog should call the datasource with arguments", async () => {
    const logRepository = new LogRepositoryImpl(mockLogDatasource);

    await logRepository.saveLog(baseLog);

    expect(mockLogDatasource.saveLog).toHaveBeenCalled();
    expect(mockLogDatasource.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogDatasource.saveLog).toHaveBeenCalledWith(baseLog);
  });

  it("getLogs should call the datasource with arguments", async () => {
    const logRepository = new LogRepositoryImpl(mockLogDatasource);

    await logRepository.saveLog(baseLog);
    await logRepository.getLogs(SeverityLevel.LOW);

    expect(mockLogDatasource.getLogs).toHaveBeenCalled();
    expect(mockLogDatasource.getLogs).toHaveBeenCalledTimes(1);
    expect(mockLogDatasource.getLogs).toHaveBeenCalledWith(SeverityLevel.LOW);
  });
});
