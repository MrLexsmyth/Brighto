// src/routes/agentRoutes.ts
import express from "express";
import {
  getAllPublicAgents,
  getPublicAgentById,
} from "../controllers/agentController";


const router = express.Router();

// Public routes
router.get("/public/list", getAllPublicAgents);
router.get("/public/:id", getPublicAgentById);

export default router;
