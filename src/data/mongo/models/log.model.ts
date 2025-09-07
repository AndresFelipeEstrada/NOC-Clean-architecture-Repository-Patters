import mongoose from "mongoose";
import type { LogEntity } from "../../../domain/entities/log.entity";

const logScheme = new mongoose.Schema<LogEntity>({
	message: { type: String, required: true },
	level: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
	origin: { type: String },
	createdAt: { type: Date, default: new Date() },
});

export const LogModel = mongoose.model("log", logScheme);
