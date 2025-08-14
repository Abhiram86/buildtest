import * as authService from "./auth.service.js";
export const githubOauth = (req, res) => {
    const url = authService.githubOauth(req);
    res.redirect(url.toString());
};
export const callback = async (req, res) => {
    const { code, state } = req.query;
    if (!state || state !== req.session.oauthState)
        return res.status(400).send("Invalid state");
    delete req.session.oauthState;
    const user = await authService.callback(code);
    req.session.userId = user._id;
    req.session.save(() => {
        res.redirect(process.env.CLIENT_URL);
    });
};
export const user = async (req, res) => {
    if (!req.session.userId)
        return res.status(401).send("Unauthorized");
    const user = await authService.getUser(req.session.userId);
    if (!user)
        return res.status(401).send("Unauthorized");
    return res.status(200).json({
        githubId: user.githubId,
        githubUsername: user.githubUsername,
        email: user.email,
        githubAvatarUrl: user.githubAvatarUrl,
        createdAt: user.createdAt,
    });
};
export const logout = (req, res) => {
    req.session.destroy(() => res.clearCookie("connect.sid").status(200).json({
        message: "Logout successful",
    }));
};
