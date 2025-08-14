var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as authService from "./auth.service";
export const githubOauth = (req, res) => {
    const url = authService.githubOauth(req);
    res.redirect(url.toString());
};
export const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
export const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
export const logout = (req, res) => {
    req.session.destroy(() => res.clearCookie("connect.sid").status(200).json({
        message: "Logout successful",
    }));
};
