import { Router } from "express";
import { requestOTP, verifyOTP } from "../controllers/auth.controller";

const router = Router();

/**
 * @openapi
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for login or signup
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Phone missing
 */
router.post("/request-otp", requestOTP);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login or signup user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 example: "Rahul Sharma"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Invalid OTP or name required
 */
router.post("/verify-otp", verifyOTP);

export default router;
