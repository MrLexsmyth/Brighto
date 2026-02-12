import mongoose from "mongoose";
import Property from "../models/Property";
import Agent, { IAgent } from "../models/Agent";
import asyncHandler from "express-async-handler";
import { uploadToCloudinary } from "../config/cloudinary";
import { AdminRequest } from "../middleware/authMiddleware";
import { Response, Request } from "express";
import slugify from "slugify";
import redisClient from "../config/redis";

// -------------------- CREATE PROPERTY --------------------
export const createProperty = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      const {
        title,
        description,
        type,
        category,
        price,
        pricePerNight,
        location,
        address,
        size,
        bedrooms,
        bathrooms,
        agentId,
      } = req.body;

      // ✅ correct validation
      if (!title || !description || !type || !category || !location || !agentId) {
        res.status(400);
        throw new Error("Missing required fields");
      }

      // Validate images
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400);
        throw new Error("At least one image is required");
      }

      const files = req.files as Express.Multer.File[];

      const images: string[] = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer))
      );

      // Generate unique slug
      let slugBase = slugify(title, { lower: true, strict: true });
      let slug = slugBase;
      let count = 1;

      while (await Property.findOne({ slug })) {
        slug = `${slugBase}-${count++}`;
      }

      // ✅ find agent using agentId
      const foundAgent = await Agent.findById(agentId);
      if (!foundAgent) {
        res.status(404);
        throw new Error("Agent not found");
      }

      // ✅ create property with correct field name
      const property = await Property.create({
        title,
        description,
        type,
        category,
        price: price ? Number(price) : undefined,
        pricePerNight: pricePerNight ? Number(pricePerNight) : undefined,
        location,
        address,
        size,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        images,
         agent: foundAgent._id,
        slug,
      });

      // Link property to agent
      await Agent.findByIdAndUpdate(foundAgent._id, {
        $push: { properties: property._id },
      });

      await redisClient.del("all_public_properties");

      res.status(201).json(property);
    } catch (error: any) {
      console.error("❌ CREATE PROPERTY ERROR:", error);
      res.status(500).json({
        message: error?.message ?? "Create property failed",
        raw: String(error),
      });
    }
  }
);



// -------------------- GET ALL PROPERTIES (ADMIN) --------------------
export const getAllProperties = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  }
);

// -------------------- DELETE PROPERTY --------------------
export const deleteProperty = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }
    await property.deleteOne();

    // Clear caches
    await redisClient.del("all_public_properties");
    await redisClient.del(`public_property:${property.slug}`);

    res.json({ message: "Property deleted" });
  }
);

// GET PROPERTY BY SLUG (ADMIN)
export const getPropertyBySlug = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const slug = req.params.slug;

    const property = await Property.findOne({ slug })
      .populate("agent", "name email title company phone"); // ✅ populate agent

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    res.json(property);
  }
);

// -------------------- GET PROPERTY BY SLUG (PUBLIC) --------------------
export const getPublicPropertyBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const cacheKey = `public_property:${slug}`;

    // Check Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const property = await Property.findOne({ slug, status: "approved" })
      .populate("agent", "name email title company phone photo"); // ✅ populate agent

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    // Store in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(property));

    res.json(property);
  }
);


// GET ALL APPROVED PROPERTIES (PUBLIC)
export const getAllPublicProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const cacheKey = "all_public_properties";

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const properties = await Property.find({ status: "approved" })
      .populate("agent", "name email title company phone photo") // ✅ fixed
      .sort({ createdAt: -1 });

    await redisClient.setEx(cacheKey, 600, JSON.stringify(properties));

    res.json(properties);
  }
);

