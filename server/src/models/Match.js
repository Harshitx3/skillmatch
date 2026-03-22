import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

matchSchema.index({ users: 1 }, { name: "match_users_multi_idx" });

const Match = mongoose.model("Match", matchSchema);
export default Match;
