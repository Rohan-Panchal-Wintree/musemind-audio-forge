import { Router } from "express";

import authRoutes from "./api/auth.route.js";

const router = Router();

router.use("/auth", authRoutes);

export default router;
