// src/routes/publicPropertyRoutes.ts
import express from "express";
import {
  getAllPublicProperties,
  getPublicPropertyBySlug,
  searchProperties, 
} from "../controllers/propertyController";

const router = express.Router();

router.get("/", getAllPublicProperties);
router.get("/search", searchProperties); // ✅ Add this route
router.get("/slug/:slug", getPublicPropertyBySlug);

export default router;