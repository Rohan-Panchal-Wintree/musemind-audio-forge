import { Router } from "express";
import {
  signup,
  login,
  updatedUsername,
  logout,
} from "../../controllers/auth.controller.js";

import protect from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-name", protect, updatedUsername);
router.post("/logout", logout);

export default router;
