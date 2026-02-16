import express from "express";
import { protect } from "../middleware/authMiddleware";
import upload from "../config/multer";
import {
  createProperty,
  getAllProperties,
  deleteProperty,
  getPropertyBySlug,
  updateProperty,
} from "../controllers/propertyController";

const router = express.Router();

/* ------------------- Admin Routes ------------------- */

// Create property
router.post("/", protect, upload.array("images", 10), createProperty);

// Get all properties (admin)
router.get("/", protect, getAllProperties);

// Delete property
router.delete("/:id", protect, deleteProperty);

// Get property by slug (admin)
router.get("/slug/:slug", protect, getPropertyBySlug);

router.put("/:id", protect, upload.array("images", 10), updateProperty);



export default router;
