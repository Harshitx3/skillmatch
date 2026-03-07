import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

requestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Request = mongoose.model("Request", requestSchema);
export default Request;
