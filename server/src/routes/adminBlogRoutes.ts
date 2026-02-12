import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogContoller";
import { protect } from "../middleware/authMiddleware";
import upload from "../config/multer"; // <--- import multer

const router = express.Router();

// All routes here require admin authentication
router.use(protect);

// Use upload.single("image") to parse one file from FormData
router.post("/", upload.single("image"), createBlog);

router.get("/", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
