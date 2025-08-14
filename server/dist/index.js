import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./modules/auth/auth.routes";
import { connectDB } from "./config/db";
import session from "express-session";
import githubRouter from "./modules/github/github.routes";
import testsRouter from "./modules/test_generator/tests.routes";
dotenv.config();
const app = express();
connectDB();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sid",
    cookie: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
}));
app.use((req, _res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use("/auth", authRouter);
app.use("/github", githubRouter);
app.use("/tests", testsRouter);
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
