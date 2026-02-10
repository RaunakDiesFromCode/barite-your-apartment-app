import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
    createSociety,
    joinSociety,
    getMySocieties,
} from "../controllers/society.controller";

const router = Router();

/**
 * @openapi
 * /societies:
 *   post:
 *     summary: Create a new society
 *     tags:
 *       - Society
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Green Valley Apartments"
 *               address:
 *                 type: string
 *                 example: "Bangalore, Karnataka"
 *     responses:
 *       200:
 *         description: Society created successfully
 *       400:
 *         description: Missing fields
 */
router.post("/", requireAuth, createSociety);

/**
 * @openapi
 * /societies/join:
 *   post:
 *     summary: Request to join a society using join code
 *     tags:
 *       - Society
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "AB12C"
 *     responses:
 *       200:
 *         description: Join request sent
 *       400:
 *         description: Already requested or invalid
 *       404:
 *         description: Invalid code
 */
router.post("/join", requireAuth, joinSociety);

/**
 * @openapi
 * /societies/mine:
 *   get:
 *     summary: Get societies the user belongs to
 *     tags:
 *       - Society
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of societies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   societyId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   role:
 *                     type: string
 *                     example: "ADMIN"
 *                   status:
 *                     type: string
 *                     example: "APPROVED"
 */
router.get("/mine", requireAuth, getMySocieties);

export default router;
