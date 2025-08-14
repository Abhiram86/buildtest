import * as arctic from "arctic";
import { Request } from "express";
import { github } from "../../config/github";
import { User } from "../../database/models/user.model";
import { encrypt } from "../../common/utils";

export const githubOauth = (req: Request) => {
  const state = arctic.generateState();
  (req as any).session.oauthState = state;
  return github.createAuthorizationURL(state, ["repo", "user:email"]);
};

export const callback = async (code: any) => {
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
  } else {
    user.githubAccessToken = encrypt(accessToken);
    await user.save();
  }

  return user;
};

export const getUser = async (userId: string) => {
  return await User.findById(userId);
};
