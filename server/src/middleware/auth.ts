import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string };
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };

        req.user = { userId: payload.userId };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
