import { Router } from "express";
import { generateAudio } from "../../controllers/audio.controller.js";
import protect from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/generate", protect, generateAudio);

export default router;
