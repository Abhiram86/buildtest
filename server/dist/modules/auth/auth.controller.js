"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.user = exports.callback = exports.githubOauth = void 0;
const authService = __importStar(require("./auth.service"));
const githubOauth = (req, res) => {
    const url = authService.githubOauth(req);
    res.redirect(url.toString());
};
exports.githubOauth = githubOauth;
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, state } = req.query;
    if (!state || state !== req.session.oauthState)
        return res.status(400).send("Invalid state");
    delete req.session.oauthState;
    const user = yield authService.callback(code);
    req.session.userId = user._id;
    req.session.save(() => {
        res.redirect(process.env.CLIENT_URL);
    });
});
exports.callback = callback;
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.userId)
        return res.status(401).send("Unauthorized");
    const user = yield authService.getUser(req.session.userId);
    if (!user)
        return res.status(401).send("Unauthorized");
    return res.status(200).json({
        githubId: user.githubId,
        githubUsername: user.githubUsername,
        email: user.email,
        githubAvatarUrl: user.githubAvatarUrl,
        createdAt: user.createdAt,
    });
});
exports.user = user;
const logout = (req, res) => {
    req.session.destroy(() => res.clearCookie("connect.sid").status(200).json({
        message: "Logout successful",
    }));
};
exports.logout = logout;
