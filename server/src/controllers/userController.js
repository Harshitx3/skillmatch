import User from "../models/User.js";
import Request from "../models/Request.js";
import Match from "../models/Match.js";
import mongoose from "mongoose";

export async function getUsers(req, res) {
  try {
    const { skills, experienceLevel, lookingFor } = req.query;
    const filter = { _id: { $ne: new mongoose.Types.ObjectId(req.userId) } };
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (lookingFor) filter.lookingFor = lookingFor;
    if (skills) {
      const arr = skills.split(",").map(s => s.trim()).filter(Boolean);
      if (arr.length) filter.skills = { $in: arr };
    }
    const users = await User.find(filter).select("-password").lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const allowed = [
      "name",
      "college",
      "skills",
      "bio",
      "githubUsername",
      "leetcodeUsername",
      "lookingFor",
      "experienceLevel"
    ];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
