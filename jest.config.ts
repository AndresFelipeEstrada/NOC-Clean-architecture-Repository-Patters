import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	clearMocks: true,
	collectCoverage: false,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	testMatch: ["**/?(*.)+(spec|test).ts"],
	coveragePathIgnorePatterns: ["/node_modules/"],
	transform: {
		"^.+\\.(t|j)s$": ["ts-jest", { useESM: true }],
	},
	transformIgnorePatterns: ["/node_modules/(?!yargs)"],
	testPathIgnorePatterns: [
		"/node_modules/",
		"/postgres/",
		"/mongo",
		"/postgres-test/",
	],
	setupFiles: ["<rootDir>/setupTests.ts"],
};

export default config;
