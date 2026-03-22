import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import jwt from "jsonwebtoken";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/devlink";

// Create HTTP server and Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store connected users: userId -> socketId
const connectedUsers = new Map();

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.userId}`);
  connectedUsers.set(socket.userId, socket.id);

  // Join a battle room for real-time updates
  socket.on("join_battle_room", (battleId) => {
    socket.join(`battle_${battleId}`);
    console.log(`⚔️  User ${socket.userId} joined battle room: ${battleId}`);
  });

  // Leave a battle room
  socket.on("leave_battle_room", (battleId) => {
    socket.leave(`battle_${battleId}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
  });
});

// Export io and connectedUsers for use in controllers
export { io, connectedUsers };

async function start() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Clean up any old unique indexes on the Match collection
    try {
      const matchColl = mongoose.connection.collection("matches");
      if (matchColl) {
        await matchColl.dropIndexes();
        console.log("✅ Dropped old match indexes to allow multiple matches");
      }
    } catch (indexError) {
      console.log("ℹ️ No old match indexes to drop or collection not yet initialized");
    }

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
