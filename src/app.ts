// import { Server } from "./presentation/server";
import { envs } from "./config/plugins/envs.plugin";
import { MongoDatabase } from "./data/mongo";

(async () => {
  await main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

  // const prisma = new PrismaClient({
  //   datasourceUrl: envs.POSTGRES_URL,
  // });

  // const newLog = await prisma.logModel.create({
  //   data: {
  //     level: "LOW",
  //     message: "test desde prisma",
  //     origin: "app.ts",
  //   },
  // });
  // await Server.start();
}
