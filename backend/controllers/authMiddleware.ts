import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const ACCESS_SECRET = process.env.ACCESS_SECRET || "SECRET_KEY";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "REFRESH_SECRET";

interface JwtPayload {
  userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers["x-refresh-token"] as string | undefined;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No access token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      try {
        const refreshDecoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;

        const newAccessToken = jwt.sign(
          { userId: refreshDecoded.userId },
          ACCESS_SECRET,
          { expiresIn: "15m" }
        );
        const newRefreshToken = jwt.sign(
          { userId: refreshDecoded.userId },
          REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);
        req.userId = refreshDecoded.userId;
        next();
      } catch {
        return res.status(403).json({ message: "Refresh token không hợp lệ" });
      }
    } else {
      res.status(401).json({ message: "Access token không hợp lệ" });
    }
  }
};
