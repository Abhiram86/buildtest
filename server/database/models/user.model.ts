import mongoose from "mongoose";

interface User {
  githubId: string;
  githubUsername: string;
  email: string;
  githubAvatarUrl: string;
  githubAccessToken: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<User>({
  githubId: { type: String, required: true, unique: true },
  githubUsername: { type: String, required: true },
  email: { type: String, unique: true },
  githubAvatarUrl: { type: String, required: true },
  githubAccessToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
