import { SeverityLevel } from "@prisma/client";
import { envs } from "../../../config/plugins/envs.plugin";
import { MongoDatabase } from "../init";
import { LogModel } from "./log.model";

beforeAll(async () => {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });
  await LogModel.deleteMany();
});

afterAll(async () => {
  await MongoDatabase.disconnect();
});

describe("log.model.ts", () => {
  it("should return logModel", async () => {
    const logData = {
      origin: "log.model.test.ts",
      message: "test-message",
      level: SeverityLevel.LOW,
    };

    const log = await LogModel.create(logData);
    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        createdAt: expect.any(Date),
        id: expect.any(String),
      }),
    );
  });

  it("should return the schema object", async () => {
    const scheme = LogModel.schema.obj;

    expect(scheme).toEqual(
      expect.objectContaining({
        message: { type: expect.any(Function), required: true },
        level: {
          type: expect.any(Function),
          enum: ["LOW", "MEDIUM", "HIGH"],
          default: "LOW",
        },
        origin: { type: expect.any(Function) },
        createdAt: expect.any(Object),
      }),
    );
  });
});
