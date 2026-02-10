import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getMe } from "../controllers/me.controller";

const router = Router();

/**
 * @openapi
 * /me:
 *   get:
 *     summary: Get current logged-in user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/me", requireAuth, getMe);

export default router;
