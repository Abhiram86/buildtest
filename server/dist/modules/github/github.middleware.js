export const githubMiddleware = (req, res, next) => {
    console.log(req.session);
    if (!req.session.userId)
        return res.status(401).send("Unauthorized");
    next();
};
