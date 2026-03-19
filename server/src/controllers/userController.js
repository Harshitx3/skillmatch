import User from "../models/User.js";
import Request from "../models/Request.js";
import Match from "../models/Match.js";
import mongoose from "mongoose";

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    // Ensure avatar is included in response
    const userData = user.toObject();
    res.json(userData);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function checkUsername(req, res) {
  try {
    const { username } = req.query;
    if (!username || username.length < 3) {
      return res.json({ available: false, message: "Username must be at least 3 characters" });
    }

    const existing = await User.findOne({
      username: username.toLowerCase(),
      _id: { $ne: req.userId }
    });

    res.json({
      available: !existing,
      message: existing ? "Username already taken" : "Username available"
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUsers(req, res) {
  try {
    const { skills, experienceLevel, lookingFor, username } = req.query;
    const filter = {
      _id: { $ne: new mongoose.Types.ObjectId(req.userId) }
    };

    // Apply specific filters first
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (lookingFor) filter.lookingFor = lookingFor;
    if (username) {
      filter.$or = [
        { username: { $regex: username, $options: "i" } },
        { name: { $regex: username, $options: "i" } }
      ];
    }
    if (skills) {
      const arr = skills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      if (arr.length) {
        filter.skills = { $in: arr.map(s => new RegExp(s, 'i')) };
      }
    }

    const users = await User.find(filter).select("-password").lean();
    res.json(users);
  } catch (e) {
    console.error("Get users error:", e);
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
      "username",
      "college",
      "skills",
      "bio",
      "githubUsername",
      "leetcodeUsername",
      "lookingFor",
      "experienceLevel",
      "avatar"
    ];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    // Check username uniqueness if being updated
    if (update.username) {
      const existing = await User.findOne({
        username: update.username.toLowerCase(),
        _id: { $ne: req.userId }
      });
      if (existing) {
        return res.status(400).json({ error: "Username already taken" });
      }
      update.username = update.username.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
