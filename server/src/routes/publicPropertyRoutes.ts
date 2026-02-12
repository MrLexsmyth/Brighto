import express from "express";
import {
  getAllPublicProperties,
  getPublicPropertyBySlug,
} from "../controllers/propertyController";

const router = express.Router();

/**
 * PUBLIC ROUTES
 * Base: /api/properties
 */

// Get all approved properties (public)
router.get("/", getAllPublicProperties);

// Get single approved property by slug (public)
router.get("/slug/:slug", getPublicPropertyBySlug);

export default router;
