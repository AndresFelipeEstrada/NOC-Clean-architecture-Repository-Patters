import { SeverityLevel } from "@prisma/client";
import { LogEntity } from "./log.entity";

describe("log.entity.ts", () => {
  const newEntity = {
    level: SeverityLevel.LOW,
    message: "test",
    origin: "log.entity.test.ts",
    createdAt: new Date(),
  };

  it("should create a LogEntity instance", async () => {
    const logEntity = new LogEntity(newEntity);

    expect(logEntity).toBeInstanceOf(LogEntity);
    expect(logEntity).toEqual(
      expect.objectContaining({
        ...newEntity,
        createdAt: expect.any(Date),
      }),
    );
  });

  it("should create a LogEntity instance fromJson", async () => {
    const json = `{"message": "Service https://google.com working","level":"LOW","createdAt":"2024-08-31T16:39:15.618Z","origin":"log.entity.test.ts"}`;
    const log = LogEntity.fromJson(json);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log).toEqual(
      expect.objectContaining({
        ...log,
        createdAt: expect.any(Date),
      }),
    );
  });

  it("should create a LogEntity instance fromObject", async () => {
    const log = LogEntity.fromObject(newEntity);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log).toEqual(
      expect.objectContaining({
        ...log,
        createdAt: expect.any(Date),
      }),
    );
  });
});
