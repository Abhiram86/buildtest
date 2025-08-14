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
exports.getUser = exports.callback = exports.githubOauth = void 0;
const arctic = __importStar(require("arctic"));
const github_1 = require("../../config/github");
const user_model_1 = require("../../database/models/user.model");
const utils_1 = require("../../common/utils");
const githubOauth = (req) => {
    const state = arctic.generateState();
    req.session.oauthState = state;
    return github_1.github.createAuthorizationURL(state, ["repo", "user:email"]);
};
exports.githubOauth = githubOauth;
const callback = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield github_1.github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const resp = yield fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const userObj = yield resp.json();
    let user = yield user_model_1.User.findOne({ githubId: userObj.id });
    if (!user) {
        user = new user_model_1.User({
            githubId: userObj.id,
            githubUsername: userObj.login,
            email: userObj.email,
            githubAvatarUrl: userObj.avatar_url,
            githubAccessToken: (0, utils_1.encrypt)(accessToken),
        });
        yield user.save();
    }
    else {
        user.githubAccessToken = (0, utils_1.encrypt)(accessToken);
        yield user.save();
    }
    return user;
});
exports.callback = callback;
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findById(userId);
});
exports.getUser = getUser;
