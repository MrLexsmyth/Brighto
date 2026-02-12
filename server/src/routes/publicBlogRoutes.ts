// server/src/routes/publicBlogRoutes.ts
import express from "express";
import {
  getAllPublishedBlogs,
  getPublishedBlogBySlug,
} from "../controllers/blogContoller";

const router = express.Router();

// No auth needed for public
router.get("/", getAllPublishedBlogs);             // Get all published blogs
router.get("/slug/:slug", getPublishedBlogBySlug); // Get published blog by slug

export default router;
