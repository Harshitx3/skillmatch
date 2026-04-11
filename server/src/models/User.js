import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    college: { type: String },
    skills: [{ type: String }],
    bio: { type: String },
    githubUsername: { type: String },
    leetcodeUsername: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    lookingFor: [{ type: String, enum: ["hackathon", "coding", "startup"] }],
    experienceLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
