import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth";

export async function getMe(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            phone: true,
            name: true,
        },
    });

    return res.json(user);
}
