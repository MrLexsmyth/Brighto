// src/routes/agentRoutes.ts
import express from "express";
import multer from "multer";
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAllPublicAgents,
  getPublicAgentById,
} from "../controllers/agentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();
const upload = multer(); 

// Admin routes
router.post("/", protect, upload.single("photo"), createAgent); 
router.get("/", protect, getAllAgents);
router.get("/:id", protect, getAgentById);
router.put("/:id", protect, upload.single("photo"), updateAgent);
router.delete("/:id", protect, deleteAgent);

// Public routes
router.get("/public/list", getAllPublicAgents);
router.get("/public/:id", getPublicAgentById);

export default router;
