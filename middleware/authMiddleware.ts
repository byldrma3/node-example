import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded !== "string" && decoded.id) {
        req.user = { _id: decoded.id };
      }
      next();
    } catch (error) {
      res.status(401).json({ error: "Token doğrulanamadı." });
    }
  } else {
    res.status(401).json({ error: "Yetkilendirme başlığı bulunamadı." });
  }
};
