import Match from "../models/Match.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export async function getMatches(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const matches = await Match.find({ users: userId }).lean();
    const otherIds = matches
      .map(m => m.users.find(u => u.toString() !== userId.toString()))
      .filter(Boolean);
    const users = await User.find({ _id: { $in: otherIds } })
      .select("name email githubUsername leetcodeUsername college skills lookingFor experienceLevel bio")
      .lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
