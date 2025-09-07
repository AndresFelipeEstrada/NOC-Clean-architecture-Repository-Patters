import fs from "node:fs";
import path from "node:path";
import { FileSystemDatasource } from "./file-system.datasources";

describe("file-system.datasources.ts", () => {
  const logPath = path.join(__dirname, "../../../logs");
  const allLogsPath = "logs/logs-all.log";
  const mediumLogsPath = "logs/logs-medium.log";
  const highLogsPath = "logs/logs-high.log";

  beforeEach(() => {
    if (fs.existsSync(logPath)) {
      fs.rmSync(logPath, { recursive: true, force: true });
    }
  });

  it("should create log files if they do not exists", async () => {
    new FileSystemDatasource();
    const files = fs.readdirSync(logPath);

    expect(files).toEqual(["logs-all.log", "logs-high.log", "logs-medium.log"]);
  });
});
