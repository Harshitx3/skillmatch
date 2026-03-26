import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    organization: { type: String, default: "" },
    description: { type: String, required: true },
    type: { type: String, default: "hackathon" },
    date: { type: Date, required: true },
    mode: { type: String, enum: ["online", "offline"], required: true },
    location: { type: String, default: "" },
    registrationLink: { type: String, default: "" },
    teamSize: { type: Number, default: 1 },
    image: { type: String, default: "" },
    price: { type: String, enum: ["Free", "Paid"], default: "Free" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
