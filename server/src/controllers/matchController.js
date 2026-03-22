import Match from "../models/Match.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import mongoose from "mongoose";

export async function getMatches(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const matches = await Match.find({ users: userId }).lean();
    
    const otherIds = matches
      .map(m => m.users.find(u => u.toString() !== userId.toString()))
      .filter(Boolean);
      
    const users = await User.find({ _id: { $in: otherIds } })
      .select("name username email avatar githubUsername leetcodeUsername college skills lookingFor experienceLevel bio")
      .lean();
      
    res.json(users);
  } catch (e) {
    console.error("Get matches error:", e);
    res.status(500).json({ error: "Server error" });
  }
}

export async function removeMatch(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const otherId = new mongoose.Types.ObjectId(req.params.id);

    // Find and delete the match
    const deletedMatch = await Match.findOneAndDelete({
      users: { $all: [userId, otherId] }
    });

    if (!deletedMatch) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Delete requests so they can swipe again
    await Request.deleteMany({
      $or: [
        { fromUser: userId, toUser: otherId },
        { fromUser: otherId, toUser: userId }
      ]
    });

    res.json({ message: "Match removed successfully" });
  } catch (e) {
    console.error("Remove match error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
