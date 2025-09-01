import mongoose from "mongoose";
import { envs } from "../../config/plugins/envs.plugin";
import { MongoDatabase } from "./init";

describe("init.ts MongoDB", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await MongoDatabase.disconnect();
	});

	it("should connect to MongoDB", async () => {
		const connected = await MongoDatabase.connect({
			mongoUrl: envs.MONGO_URL,
			dbName: envs.MONGO_DB_NAME,
		});

		expect(connected).toBeTruthy();
	});

	it("should throw an error", async () => {
		try {
			await MongoDatabase.connect({
				mongoUrl: "fakeUrl",
				dbName: envs.MONGO_DB_NAME,
			});
			expect(true).toBe(false);
		} catch (error) {}
	});

	it("should call mongoose.disconnect", async () => {
    const spy = jest.spyOn(mongoose, "disconnect").mockResolvedValue()
		await MongoDatabase.disconnect();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(MongoDatabase.disconnect).toBeTruthy();
	});
});
