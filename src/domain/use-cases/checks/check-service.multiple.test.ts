import { SeverityLevel } from "@prisma/client";
import { LogEntity } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";
import { CheckServiceMuliple } from "./check-service.multiple";

describe("check-service.multiple.ts", () => {
  const mockRepo1: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const mockRepo2: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const mockRepo3: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const succesCallback = jest.fn();
  const errorCallback = jest.fn();
  const checkServiceMuliple = new CheckServiceMuliple(
    [mockRepo1, mockRepo2, mockRepo3],
    succesCallback,
    errorCallback,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call succesCallback when fetch return true", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    const url = "https://google.com";

    const response = await checkServiceMuliple.execute(url);

    expect(response).toBe(true);

    expect(mockRepo1.saveLog).toHaveBeenCalled();
    expect(mockRepo2.saveLog).toHaveBeenCalled();
    expect(mockRepo3.saveLog).toHaveBeenCalled();

    expect(mockRepo1.saveLog).toHaveBeenCalledTimes(1);
    expect(mockRepo2.saveLog).toHaveBeenCalledTimes(1);
    expect(mockRepo3.saveLog).toHaveBeenCalledTimes(1);

    expect(mockRepo1.saveLog).toHaveBeenCalledWith({
      createdAt: expect.any(Date),
      level: SeverityLevel.LOW,
      message: `Service ${url} working`,
      origin: "check-service.ts",
    });

    expect(mockRepo1.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo2.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo3.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));

    expect(succesCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should call errorCallback when fetch return false", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const url = "hp:/fakeUrl.com";
    const response = await checkServiceMuliple.execute(url);

    expect(response).toBeFalsy();

    expect(errorCallback).toHaveBeenCalled();
    expect(succesCallback).not.toHaveBeenCalled();

    expect(mockRepo1.saveLog).toHaveBeenCalledTimes(1);
    expect(mockRepo2.saveLog).toHaveBeenCalledTimes(1);
    expect(mockRepo3.saveLog).toHaveBeenCalledTimes(1);

    expect(mockRepo1.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo2.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo3.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
});
