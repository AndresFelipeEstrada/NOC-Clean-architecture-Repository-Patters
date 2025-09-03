import { LogEntity } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";
import { CheckService } from "./check-service";

describe("check-service.ts", () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });

  const mockLogRepository: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const succesCallback = jest.fn();
  const errorCallback = jest.fn();
  const checkService = new CheckService(
    mockLogRepository,
    succesCallback,
    errorCallback,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call succesCallback when fetch return true", async () => {
    const url = "https://google.com";
    const response = await checkService.execute(url);

    expect(response).toBeTruthy();

    expect(mockLogRepository.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity),
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith({
      createdAt: expect.any(Date),
      level: "LOW",
      message: `Service ${url} working`,
      origin: "check-service.ts",
    });

    expect(succesCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should call errorCallback when fetch return false", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const url = "hp:/fakeUrl.com";
    const response = await checkService.execute(url);

    expect(response).toBeFalsy();

    expect(errorCallback).toHaveBeenCalled();
    expect(succesCallback).not.toHaveBeenCalled();

    expect(mockLogRepository.saveLog).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity),
    );
  });
});
