// src/routes/userRoutes.ts
import express from "express";
import {  createUser , UpdateUserPassword , updateUserInformation , UpdateUserContactInfo, getUserInfo} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


//FOR VALIDATING THE REQUEST BODY
router.post("/" , createUser);
router.put("/update-email", authenticate , updateUserInformation);
router.put("/update-password", authenticate , UpdateUserPassword);
router.put("/update-contact-info", authenticate , UpdateUserContactInfo);
router.get("/me", authenticate, getUserInfo);



export default router;
