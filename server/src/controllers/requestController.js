import Request from "../models/Request.js";
import Match from "../models/Match.js";
import mongoose from "mongoose";

function sortPair(a, b) {
  const s = [a.toString(), b.toString()].sort();
  return s;
}

export async function createRequest(req, res) {
  try {
    const fromUser = new mongoose.Types.ObjectId(req.userId);
    const { toUser } = req.body;
    if (!toUser) return res.status(400).json({ error: "Missing toUser" });
    if (toUser === req.userId) return res.status(400).json({ error: "Invalid target" });
    const toId = new mongoose.Types.ObjectId(toUser);
    const existing = await Request.findOne({
      $or: [
        { fromUser, toUser: toId, status: { $in: ["pending", "accepted"] } },
        { fromUser: toId, toUser: fromUser, status: { $in: ["pending", "accepted"] } }
      ]
    });
    if (existing) return res.status(400).json({ error: "Already requested" });
    const reqDoc = await Request.create({ fromUser, toUser: toId, status: "pending" });
    res.status(201).json(reqDoc);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getPending(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const docs = await Request.find({ toUser: userId, status: "pending" })
      .populate("fromUser", "-password")
      .lean();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function acceptRequest(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const r = await Request.findOne({ _id: req.params.id, toUser: userId, status: "pending" });
    if (!r) return res.status(404).json({ error: "Not found" });
    r.status = "accepted";
    await r.save();
    const pair = sortPair(r.fromUser, r.toUser);
    const exists = await Match.findOne({ users: pair });
    if (!exists) await Match.create({ users: pair });
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function rejectRequest(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const r = await Request.findOne({ _id: req.params.id, toUser: userId, status: "pending" });
    if (!r) return res.status(404).json({ error: "Not found" });
    r.status = "rejected";
    await r.save();
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
