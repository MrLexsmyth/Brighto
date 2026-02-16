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
        location, // This will be a JSON string from FormData
        size,
        bedrooms,
        bathrooms,
        agentId,
      } = req.body;

      // Parse location from JSON string
      let locationObj;
      try {
        locationObj = typeof location === 'string' ? JSON.parse(location) : location;
        console.log("📍 Parsed location:", locationObj);
      } catch (error) {
        res.status(400);
        throw new Error("Invalid location data format");
      }

      // Validate location structure
      if (!locationObj || !locationObj.address || !locationObj.city || !locationObj.state) {
        res.status(400);
        throw new Error("Location must include address, city, and state");
      }

      if (!locationObj.coordinates || 
          typeof locationObj.coordinates.lat !== 'number' || 
          typeof locationObj.coordinates.lng !== 'number') {
        res.status(400);
        throw new Error("Location must include valid coordinates (lat, lng)");
      }

      // Validate required fields
      if (!title || !description || !type || !category || !agentId) {
        res.status(400);
        throw new Error("Missing required fields");
      }

      // Validate images
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400);
        throw new Error("At least one image is required");
      }

      const files = req.files as Express.Multer.File[];

      // Upload images to Cloudinary
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

      // Find agent
      const foundAgent = await Agent.findById(agentId);
      if (!foundAgent) {
        res.status(404);
        throw new Error("Agent not found");
      }

      // Create property with location object
      const property = await Property.create({
        title,
        description,
        type,
        category,
        price: price ? Number(price) : undefined,
        pricePerNight: pricePerNight ? Number(pricePerNight) : undefined,
        location: locationObj, // Use the parsed location object
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

      // Clear Redis cache
      await redisClient.del("all_public_properties");

      console.log("✅ Property created successfully:", property._id);
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

// -------------------- UPDATE PROPERTY --------------------
export const updateProperty = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    try {
      const { id } = req.params;
      const property = await Property.findById(id);

      if (!property) {
        res.status(404);
        throw new Error("Property not found");
      }

      const {
        title,
        description,
        type,
        category,
        price,
        pricePerNight,
        location,
        size,
        bedrooms,
        bathrooms,
        status,
        agentId,
      } = req.body;

      // Parse location if it's a string
      let locationObj = location;
      if (typeof location === 'string') {
        try {
          locationObj = JSON.parse(location);
        } catch (error) {
          res.status(400);
          throw new Error("Invalid location data format");
        }
      }

      // Update basic fields
      if (title) property.title = title;
      if (description) property.description = description;
      if (type) property.type = type;
      if (category) property.category = category;
      if (price !== undefined) property.price = Number(price);
      if (pricePerNight !== undefined) property.pricePerNight = Number(pricePerNight);
      if (locationObj) property.location = locationObj;
      if (size) property.size = size;
      if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
      if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
      if (status) property.status = status;
      if (agentId) property.agent = agentId;

      // Handle new images if uploaded
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const files = req.files as Express.Multer.File[];
        const uploadedImages: string[] = await Promise.all(
          files.map((file) => uploadToCloudinary(file.buffer))
        );
        property.images = uploadedImages;
      }

      const updatedProperty = await property.save();

      // Clear caches
      await redisClient.del("all_public_properties");
      await redisClient.del(`public_property:${property.slug}`);

      res.json(updatedProperty);
    } catch (error: any) {
      console.error("❌ UPDATE PROPERTY ERROR:", error);
      res.status(500).json({
        message: error?.message ?? "Update property failed",
      });
    }
  }
);

// -------------------- GET ALL PROPERTIES (ADMIN) --------------------
export const getAllProperties = asyncHandler(
  async (req: AdminRequest, res: Response) => {
    const properties = await Property.find()
      .populate("agent", "name email")
      .sort({ createdAt: -1 });
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
      .populate("agent", "name email title company phone");

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
      .populate("agent", "name email title company phone photo");

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
      .populate("agent", "name email title company phone photo")
      .sort({ createdAt: -1 });

    await redisClient.setEx(cacheKey, 600, JSON.stringify(properties));

    res.json(properties);
  }
);

// -------------------- SEARCH/FILTER PROPERTIES (PUBLIC) --------------------
export const searchProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      type,
      category,
      city,
      state,
      area,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
    } = req.query;

    // Build filter object
    const filter: any = { status: "approved" };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter["location.city"] = city;
    if (state) filter["location.state"] = state;
    if (area) filter["location.area"] = { $regex: area, $options: "i" }; // Case-insensitive

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };

    const properties = await Property.find(filter)
      .populate("agent", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      count: properties.length,
      properties,
    });
  }
);