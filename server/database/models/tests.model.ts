import mongoose from "mongoose";

interface Test {
  user: mongoose.Types.ObjectId;
  repo: string;
  filePaths: string[];
  test_response: string;
  createdAt: Date;
  updatedAt: Date;
}

const testSchema = new mongoose.Schema<Test>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  repo: { type: String, required: true },
  filePaths: { type: [String], required: true },
  test_response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Test = mongoose.model("Test", testSchema);
