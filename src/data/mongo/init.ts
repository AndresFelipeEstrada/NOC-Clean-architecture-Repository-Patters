import mongoose from "mongoose";

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions) {
    try {
      await mongoose.connect(options.mongoUrl, {
        dbName: options.dbName,
      });
      console.log("Mongo connected!");
    } catch (error) {
      console.log("Mongo error");
      throw error;
    }
  }
}
