import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createSociety, getMySocieties, joinSociety } from "../controllers/society.controller";

const router = Router();

router.post("/", requireAuth, createSociety);
router.post("/join", requireAuth, joinSociety);
router.get("/mine", requireAuth, getMySocieties);

export default router;
