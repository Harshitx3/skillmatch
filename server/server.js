import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/devlink";

async function start() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      // no-op
    });
  } catch (err) {
    process.exit(1);
  }
}

start();
