import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.userId = decoded.id;
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
