import { Request, Response, NextFunction } from "express";

export const testsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.session);
  if (!(req.session as any).userId) return res.status(401).send("Unauthorized");
  next();
};
