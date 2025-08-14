import * as arctic from "arctic";
import dotenv from "dotenv";
dotenv.config();
export const github = new arctic.GitHub(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, process.env.GITHUB_CALLBACK_URL);
