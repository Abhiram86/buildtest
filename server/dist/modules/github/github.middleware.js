"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubMiddleware = void 0;
const githubMiddleware = (req, res, next) => {
    console.log(req.session);
    if (!req.session.userId)
        return res.status(401).send("Unauthorized");
    next();
};
exports.githubMiddleware = githubMiddleware;
