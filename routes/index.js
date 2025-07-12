import { Router } from "express";
import authRoutes from "./api/auth.route.js";
import audioRoutes from "./api/audio.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/audio", audioRoutes);

export default router;
