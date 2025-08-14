import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    githubId: { type: String, required: true, unique: true },
    githubUsername: { type: String, required: true },
    email: { type: String, unique: true },
    githubAvatarUrl: { type: String, required: true },
    githubAccessToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
export const User = mongoose.model("User", userSchema);
