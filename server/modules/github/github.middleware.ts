import { NextFunction, Request, Response } from "express";

export const githubMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.session);
  if (!(req.session as any).userId) return res.status(401).send("Unauthorized");
  next();
};
