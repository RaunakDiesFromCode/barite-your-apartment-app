import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth";
import { generateJoinCode } from "../utils/joinCode";

export async function createSociety(req: AuthRequest, res: Response) {
    const { name, address } = req.body;
    const userId = req.user!.userId;

    if (!name || !address) {
        return res.status(400).json({ error: "Name and address required" });
    }

    let joinCode: string;

    // Ensure uniqueness
    while (true) {
        joinCode = generateJoinCode();
        const exists = await prisma.society.findUnique({
            where: { joinCode },
        });
        if (!exists) break;
    }

    const society = await prisma.society.create({
        data: {
            name,
            address,
            joinCode,
            createdById: userId,
            members: {
                create: {
                    userId,
                    role: "ADMIN",
                    status: "APPROVED",
                },
            },
        },
    });

    return res.json(society);
}

export async function joinSociety(req: AuthRequest, res: Response) {
    const { code } = req.body;
    const userId = req.user!.userId;

    if (!code) {
        return res.status(400).json({ error: "Code required" });
    }

    const society = await prisma.society.findUnique({
        where: { joinCode: code.toUpperCase() },
    });

    if (!society) {
        return res.status(404).json({ error: "Invalid code" });
    }

    const existing = await prisma.societyMember.findUnique({
        where: {
            userId_societyId: {
                userId,
                societyId: society.id,
            },
        },
    });

    if (existing) {
        return res.status(400).json({ error: "Already requested or member" });
    }

    await prisma.societyMember.create({
        data: {
            userId,
            societyId: society.id,
            role: "OWNER",
            status: "PENDING",
        },
    });

    return res.json({ success: true });
}

export async function getMySocieties(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;

    const memberships = await prisma.societyMember.findMany({
        where: { userId },
        include: {
            society: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    joinCode: true,
                },
            },
        },
    });

    return res.json(
        memberships.map((m) => ({
            societyId: m.society.id,
            name: m.society.name,
            address: m.society.address,
            role: m.role,
            status: m.status,
        })),
    );
}
