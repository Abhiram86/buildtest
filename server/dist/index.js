"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const db_1 = require("./config/db");
const express_session_1 = __importDefault(require("express-session"));
const github_routes_1 = __importDefault(require("./modules/github/github.routes"));
const tests_routes_1 = __importDefault(require("./modules/test_generator/tests.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
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
app.use("/auth", auth_routes_1.default);
app.use("/github", github_routes_1.default);
app.use("/tests", tests_routes_1.default);
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
