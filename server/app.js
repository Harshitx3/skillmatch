import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import matchRoutes from "./src/routes/matchRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import battleRoutes from "./src/routes/battleRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*"
})); // Allow all origins for debugging CORS issues in production
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/battles", battleRoutes);
app.use("/api", contactRoutes);
app.get("/",(req,res)=>{
  res.send("Backend is live");
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});


export default app;
