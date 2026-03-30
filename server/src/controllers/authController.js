import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Admin credentials - change these to your preferred admin email/password
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nodematch.com";
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
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) return res.status(400).json({ error: "Missing fields" });

    // Verify OTP again just to be safe before creating user
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ error: "Invalid or expired OTP" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email in use" });
    
    const user = new User({ name, email, password });
    await user.save();
    
    // Delete OTP after successful registration
    await OTP.deleteOne({ _id: otpRecord._id });

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

export async function sendOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"NodeMatch" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your NodeMatch Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #6366f1;">Welcome to NodeMatch!</h2>
          <p>Please use the following verification code to complete your registration:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (e) {
    console.error("Send OTP error:", e);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Missing fields" });

    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ error: "Invalid or expired OTP" });

    res.json({ message: "OTP verified successfully" });
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
