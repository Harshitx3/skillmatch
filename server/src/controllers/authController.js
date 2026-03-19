import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Admin credentials - change these to your preferred admin email/password
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@devlink.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function sign(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
}

function isProfileComplete(user) {
  return !!(user.college && user.bio && user.skills?.length > 0 &&
    user.githubUsername && user.leetcodeUsername &&
    user.lookingFor && user.experienceLevel);
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
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      profileComplete: false
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check for admin credentials
    const isAdminLogin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    let user = await User.findOne({ email }).select("+password");

    // If admin login but user doesn't exist, create admin user
    if (isAdminLogin && !user) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      user = new User({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
        username: "admin"
      });
      await user.save();
    }

    if (!user || !user.password) return res.status(400).json({ error: "Invalid credentials or use Google login" });

    // If not admin auto-created, verify password
    if (!isAdminLogin) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    }

    // If admin credentials used, ensure user has admin flag
    if (isAdminLogin && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    const token = sign(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      profileComplete: true // Admin doesn't need profile completion
    });
  } catch (e) {
    console.error("Login error:", e);
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
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, isAdmin: user.isAdmin },
      profileComplete: isProfileComplete(user)
    });

  } catch (e) {
    console.error("Google login error:", e);
    res.status(500).json({ error: "Google login failed" });
  }
}
