describe("envs.plugin.ts", () => {
	it("should return error if not found env", async () => {
		jest.resetModules();
		process.env.PORT = "abc";

		try {
			await import("./envs.plugin");
			expect(true).toBe(false);
		} catch (error) {
			expect(`${error}`).toContain('"PORT" should be a valid integer');
		}
	});
});
