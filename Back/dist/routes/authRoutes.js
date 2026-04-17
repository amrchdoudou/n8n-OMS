// src/routes/userRoutes.ts
import express from "express";
import { create, refreshToken, verifyToken } from "../controllers/authController.js";
const router = express.Router();
router.post("/login", create);
router.post("/refresh", refreshToken);
router.post("/verify", verifyToken);
export default router;
//# sourceMappingURL=authRoutes.js.map