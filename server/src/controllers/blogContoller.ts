// server/src/controllers/blogController.ts
import Blog from "../models/Blog";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AdminRequest } from "../middleware/authMiddleware";
import { uploadToCloudinary } from "../config/cloudinary";
import redisClient from "../config/redis";

/* ---------------------- ADMIN ---------------------- */

// Create a new blog
export const createBlog = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const { title, content, categories, tags, status } = req.body;
    const file = req.file; // multer single file

    if (!title || !content) {
      res.status(400);
      throw new Error("Title and content are required");
    }

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await uploadToCloudinary(file.buffer);
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.admin!._id,
      categories: categories ? categories.split(",").map((c: string) => c.trim()) : [],
      tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
      status: status || "draft",
      images: imageUrl ? [imageUrl] : [],
    });

    // Clear relevant caches
    await redisClient.del("all_published_blogs");

    res.status(201).json(blog);
  }
);

// Get all blogs (admin)
export const getAllBlogs = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  }
);

// Get blog by slug (admin)
export const getBlogBySlug = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    res.json(blog);
  }
);

// Update blog
export const updateBlog = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    const { title, content, images, categories, tags, status } = req.body;

    if (title) {
      blog.title = title;
      blog.slug = title.toLowerCase().replace(/\s+/g, "-");
    }
    if (content) blog.content = content;
    if (images) blog.images = images;
    if (categories) blog.categories = categories;
    if (tags) blog.tags = tags;
    if (status) blog.status = status;

    await blog.save();

    // Clear relevant caches
    await redisClient.del("all_published_blogs");
    await redisClient.del(`published_blog:${blog.slug}`);

    res.json(blog);
  }
);

// Delete blog
export const deleteBlog = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    await blog.deleteOne();

    // Clear relevant caches
    await redisClient.del("all_published_blogs");
    await redisClient.del(`published_blog:${blog.slug}`);

    res.json({ message: "Blog deleted" });
  }
);

/* ---------------------- PUBLIC ---------------------- */

// Get all published blogs (public)
export const getAllPublishedBlogs = asyncHandler(
  async (req: Request, res: Response) => {
    const cacheKey = "all_published_blogs";

    // Check Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });

    // Cache for 15 minutes
    await redisClient.setEx(cacheKey, 900, JSON.stringify(blogs));

    res.json(blogs);
  }
);

// Get published blog by slug (public)
export const getPublishedBlogBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const cacheKey = `published_blog:${slug}`;

    // Check Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const blog = await Blog.findOne({ slug, status: "published" });
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    // Cache for 30 minutes
    await redisClient.setEx(cacheKey, 1800, JSON.stringify(blog));

    res.json(blog);
  }
);
