import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createSociety, joinSociety } from "../controllers/society.controller";

const router = Router();

router.post("/", requireAuth, createSociety);
router.post("/join", requireAuth, joinSociety);

export default router;
