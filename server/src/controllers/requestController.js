import Request from "../models/Request.js";
import Match from "../models/Match.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { io, connectedUsers } from "../../server.js";

function sortPair(a, b) {
  const s = [a.toString(), b.toString()].sort();
  return s;
}

export async function createRequest(req, res) {
  try {
    const fromUser = new mongoose.Types.ObjectId(req.userId);
    const { toUser } = req.body;

    if (!toUser) return res.status(400).json({ error: "Missing toUser" });
    if (toUser === req.userId) return res.status(400).json({ error: "Cannot send request to yourself" });

    // Validate toUser is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(toUser)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const toId = new mongoose.Types.ObjectId(toUser);

    // Check if target user exists
    const targetUser = await User.findById(toId);
    if (!targetUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check for existing pending or accepted requests (blocked statuses)
    const existing = await Request.findOne({
      $or: [
        { fromUser, toUser: toId, status: { $in: ["pending", "accepted"] } },
        { fromUser: toId, toUser: fromUser, status: { $in: ["pending", "accepted"] } }
      ]
    });

    if (existing) {
      if (existing.status === "accepted") {
        return res.status(400).json({ error: "Already connected with this user" });
      }
      return res.status(400).json({ error: "Request already sent and pending" });
    }

    // Check if there's a rejected request from this user to the target
    // If so, update it to pending (resend)
    const rejectedRequest = await Request.findOne({
      fromUser,
      toUser: toId,
      status: "rejected"
    });

    let reqDoc;
    if (rejectedRequest) {
      // Resend: update the rejected request to pending
      rejectedRequest.status = "pending";
      rejectedRequest.createdAt = new Date();
      await rejectedRequest.save();
      reqDoc = rejectedRequest;
    } else {
      // Create new request
      reqDoc = await Request.create({ fromUser, toUser: toId, status: "pending" });
    }

    // Get from user details for the notification
    const fromUserDetails = await User.findById(req.userId).select("name username avatar");

    // Emit real-time notification to the target user if they're online
    const targetSocketId = connectedUsers.get(toUser);
    if (targetSocketId) {
      io.to(targetSocketId).emit("new_like", {
        fromUser: {
          id: fromUserDetails._id,
          name: fromUserDetails.name,
          username: fromUserDetails.username,
          avatar: fromUserDetails.avatar
        },
        requestId: reqDoc._id,
        timestamp: new Date()
      });
    }

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

export async function getSent(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    // Return all requests sent by user (pending, accepted, rejected)
    // so frontend can track which users can be requested again
    const docs = await Request.find({ fromUser: userId })
      .select("toUser status createdAt")
      .lean();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function acceptRequest(req, res) {
  try {
    const { id } = req.params;

    // Validate request ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const r = await Request.findOne({ _id: id, toUser: userId, status: "pending" });

    if (!r) {
      return res.status(404).json({ error: "Request not found or already processed" });
    }

    r.status = "accepted";
    await r.save();

    const pair = sortPair(r.fromUser, r.toUser);
    const exists = await Match.findOne({ users: pair });
    if (!exists) await Match.create({ users: pair });

    res.json(r);
  } catch (e) {
    console.error("Accept request error:", e);
    res.status(500).json({ error: "Server error" });
  }
}

export async function rejectRequest(req, res) {
  try {
    const { id } = req.params;

    // Validate request ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const r = await Request.findOne({ _id: id, toUser: userId, status: "pending" });

    if (!r) {
      return res.status(404).json({ error: "Request not found or already processed" });
    }

    r.status = "rejected";
    await r.save();
    res.json(r);
  } catch (e) {
    console.error("Reject request error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
