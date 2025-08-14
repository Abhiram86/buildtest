import { Request, Response } from "express";
import * as authService from "./auth.service";

export const githubOauth = (req: Request, res: Response) => {
  const url = authService.githubOauth(req);
  res.redirect(url.toString());
};

export const callback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  if (!state || state !== (req.session as any).oauthState)
    return res.status(400).send("Invalid state");
  delete (req.session as any).oauthState;

  const user = await authService.callback(code);

  (req.session as any).userId = user._id;
  req.session.save(() => {
    res.redirect(process.env.CLIENT_URL!);
  });
};

export const user = async (req: Request, res: Response) => {
  if (!(req.session as any).userId) return res.status(401).send("Unauthorized");
  const user = await authService.getUser((req.session as any).userId);
  if (!user) return res.status(401).send("Unauthorized");
  return res.status(200).json({
    githubId: user.githubId,
    githubUsername: user.githubUsername,
    email: user.email,
    githubAvatarUrl: user.githubAvatarUrl,
    createdAt: user.createdAt,
  });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() =>
    res.clearCookie("connect.sid").status(200).json({
      message: "Logout successful",
    })
  );
};
