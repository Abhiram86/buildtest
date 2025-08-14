import * as arctic from "arctic";
import { github } from "../../config/github";
import { User } from "../../database/models/user.model";
import { encrypt } from "../../common/utils";
export const githubOauth = (req) => {
    const state = arctic.generateState();
    req.session.oauthState = state;
    return github.createAuthorizationURL(state, ["repo", "user:email"]);
};
export const callback = async (code) => {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const resp = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const userObj = await resp.json();
    let user = await User.findOne({ githubId: userObj.id });
    if (!user) {
        user = new User({
            githubId: userObj.id,
            githubUsername: userObj.login,
            email: userObj.email,
            githubAvatarUrl: userObj.avatar_url,
            githubAccessToken: encrypt(accessToken),
        });
        await user.save();
    }
    else {
        user.githubAccessToken = encrypt(accessToken);
        await user.save();
    }
    return user;
};
export const getUser = async (userId) => {
    return await User.findById(userId);
};
