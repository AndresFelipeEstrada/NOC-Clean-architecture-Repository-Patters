import { SeverityLevel } from "@prisma/client";
import { LogEntity } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";
import { CheckServiceMuliple } from "./check-service.multiple";

describe("check-service.multiple.ts", () => {
  const mockRepositories: LogRepository[] = [
    {
      saveLog: jest.fn(),
      getLogs: jest.fn(),
    },

    {
      saveLog: jest.fn(),
      getLogs: jest.fn(),
    },

    {
      saveLog: jest.fn(),
      getLogs: jest.fn(),
    },
  ];

  const succesCallback = jest.fn();
  const errorCallback = jest.fn();
  const checkServiceMuliple = new CheckServiceMuliple(
    mockRepositories,
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

    mockRepositories.forEach((repository) => {
      expect(repository.saveLog).toHaveBeenCalled();
      expect(repository.saveLog).toHaveBeenCalledTimes(1);
      expect(repository.saveLog).toHaveBeenCalledWith({
        createdAt: expect.any(Date),
        level: SeverityLevel.LOW,
        message: `Service ${url} working`,
        origin: "check-service.ts",
      });
      expect(repository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    });

    expect(succesCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should call errorCallback when fetch return false", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const url = "hp:/fakeUrl.com";
    const response = await checkServiceMuliple.execute(url);

    expect(response).toBe(false);

    mockRepositories.forEach((repository) => {
      expect(repository.saveLog).toHaveBeenCalledTimes(1);
      expect(repository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    });

    expect(errorCallback).toHaveBeenCalled();
    expect(succesCallback).not.toHaveBeenCalled();
  });
});
