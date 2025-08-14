var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as arctic from "arctic";
import { github } from "../../config/github";
import { User } from "../../database/models/user.model";
import { encrypt } from "../../common/utils";
export const githubOauth = (req) => {
    const state = arctic.generateState();
    req.session.oauthState = state;
    return github.createAuthorizationURL(state, ["repo", "user:email"]);
};
export const callback = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const resp = yield fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const userObj = yield resp.json();
    let user = yield User.findOne({ githubId: userObj.id });
    if (!user) {
        user = new User({
            githubId: userObj.id,
            githubUsername: userObj.login,
            email: userObj.email,
            githubAvatarUrl: userObj.avatar_url,
            githubAccessToken: encrypt(accessToken),
        });
        yield user.save();
    }
    else {
        user.githubAccessToken = encrypt(accessToken);
        yield user.save();
    }
    return user;
});
export const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findById(userId);
});
