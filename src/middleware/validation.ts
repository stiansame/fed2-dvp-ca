import { Request, Response, NextFunction } from "express";

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  next();
};

export const validaterequiredUserData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required!" });
  }
  next();
};

export const validatePartialUserData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email } = req.body;
  if (!username && !email) {
    return res
      .status(400)
      .json({ error: "At least one of username or email is required" });
  }
  next();
};
