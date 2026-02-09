import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { generateOTP, hashOTP } from "../utils/otp";
import {
    OTP_EXPIRY_MINUTES,
    OTP_MAX_ATTEMPTS,
    JWT_EXPIRY,
} from "../config/constants";

export async function requestOTP(req: Request, res: Response) {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: "Phone is required" });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.oTP.create({
        data: {
            phone,
            otpHash,
            expiresAt,
        },
    });

    // TEMP: log OTP (remove when SMS provider is added)
    console.log(`OTP for ${phone}: ${otp}`);

    return res.json({ success: true });
}

export async function verifyOTP(req: Request, res: Response) {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: "Phone and OTP are required" });
    }

    const otpRecord = await prisma.oTP.findFirst({
        where: { phone },
        orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
        return res.status(400).json({ error: "OTP attempts exceeded" });
    }

    if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ error: "OTP expired" });
    }

    const isValid = hashOTP(otp) === otpRecord.otpHash;

    if (!isValid) {
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
        });

        return res.status(400).json({ error: "Invalid OTP" });
    }

    let user = await prisma.user.findUnique({
        where: { phone },
    });

    if (!user) {
        if (!name) {
            return res.status(400).json({ error: "Name required for signup" });
        }

        user = await prisma.user.create({
            data: { phone, name },
        });
    }

    // Cleanup OTPs
    await prisma.oTP.deleteMany({ where: { phone } });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: JWT_EXPIRY,
    });

    return res.json({
        token,
        user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
        },
    });
}
