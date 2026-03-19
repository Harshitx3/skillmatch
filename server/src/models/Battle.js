import mongoose from "mongoose";
import { nanoid } from "nanoid";

const battleSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [{ type: String }], // external problem links
    difficulty: { type: String, enum: ["easy", "medium", "hard", "mixed"], default: "medium" },
    duration: { type: Number, default: 60 }, // minutes
    minPlayers: { type: Number, default: 2 },
    inviteCode: { type: String, unique: true, default: () => nanoid(8).toUpperCase() },
    status: { type: String, enum: ["waiting", "live", "completed"], default: "waiting" },
    startTime: { type: Date },
}, { timestamps: true });

export default mongoose.model("Battle", battleSchema);
