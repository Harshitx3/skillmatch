import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function sign(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email in use" });
    const user = new User({ name, email, password });
    await user.save();
    const token = sign(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) return res.status(400).json({ error: "Invalid credentials or use Google login" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = sign(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.avatar = user.avatar || avatar;
        await user.save();
      } else {
        user = new User({
          name,
          email,
          googleId,
          avatar,
        });
        await user.save();
      }
    }

    const token = sign(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });

  } catch (e) {
    console.error("Google login error:", e);
    res.status(500).json({ error: "Google login failed" });
  }
}
