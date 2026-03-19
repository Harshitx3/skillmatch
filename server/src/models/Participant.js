import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    battleId: { type: mongoose.Schema.Types.ObjectId, ref: "Battle", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
}, { timestamps: false });

// Prevent duplicate participants
participantSchema.index({ battleId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Participant", participantSchema);
