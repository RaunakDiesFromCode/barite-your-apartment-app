import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getMe } from "../controllers/me.controller";

const router = Router();

router.get("/me", requireAuth, getMe);

export default router;
