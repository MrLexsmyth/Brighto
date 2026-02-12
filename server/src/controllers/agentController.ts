// src/controllers/agentController.ts
import Agent, { IAgent } from "../models/Agent";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { uploadToCloudinary } from "../config/cloudinary"; // your cloudinary helper
import redisClient from "../config/redis";

// -------------------- CREATE AGENT --------------------
export const createAgent = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    title,
    company,
    bio,
    email,
    phone,
    website,
    serviceAreas,
    specialties,
    propertyTypes,
  } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const existing = await Agent.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Agent with this email already exists");
  }

  // Handle photo upload if file exists
  let photoUrl: string | undefined;
  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file.buffer); // <-- returns string URL
  }

  const agent = await Agent.create({
    name,
    title,
    company,
    bio,
    email,
    phone,
    website,
    photo: photoUrl,
    serviceAreas: serviceAreas?.split(",") || [],
    specialties: specialties?.split(",") || [],
    propertyTypes: propertyTypes ? JSON.parse(propertyTypes) : [],
    properties: [],
  });

  res.status(201).json(agent);
});

// -------------------- GET ALL AGENTS (ADMIN) --------------------
export const getAllAgents = asyncHandler(async (req: Request, res: Response) => {
  const agents = await Agent.find().sort({ createdAt: -1 });
  res.json(agents);
});

// -------------------- GET SINGLE AGENT (ADMIN) --------------------
export const getAgentById = asyncHandler(async (req: Request, res: Response) => {
  const agent = await Agent.findById(req.params.id).populate({
    path: "properties",
    select: "title price type location images slug",
  });
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }
  res.json(agent);
});

// -------------------- UPDATE AGENT --------------------
export const updateAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }

  const {
    name,
    title,
    company,
    bio,
    email,
    phone,
    website,
    photo,
    serviceAreas,
    specialties,
    propertyTypes,
  } = req.body;

  agent.name = name ?? agent.name;
  agent.title = title ?? agent.title;
  agent.company = company ?? agent.company;
  agent.email = email ?? agent.email;
  agent.phone = phone ?? agent.phone;
  agent.website = website ?? agent.website;
  agent.bio = bio ?? agent.bio;
  agent.photo = photo ?? agent.photo;
  agent.serviceAreas = serviceAreas ?? agent.serviceAreas;
  agent.specialties = specialties ?? agent.specialties;
  agent.propertyTypes = propertyTypes ?? agent.propertyTypes;

  await agent.save();
  res.json(agent);
});

// -------------------- DELETE AGENT --------------------
export const deleteAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }

  await agent.deleteOne();
  res.json({ message: "Agent deleted" });
});

// -------------------- GET ALL AGENTS (PUBLIC) --------------------
export const getAllPublicAgents = asyncHandler(async (req: Request, res: Response) => {
  const cacheKey = "all_public_agents";
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    res.json(JSON.parse(cached));
    return;
  }

  const agents = await Agent.find()
    .populate({
      path: "properties",
      match: { status: "approved" },
      select: "title price type location images slug",
    })
    .sort({ createdAt: -1 });

  await redisClient.setEx(cacheKey, 600, JSON.stringify(agents));
  res.json(agents);
});

// -------------------- GET SINGLE AGENT (PUBLIC) --------------------
export const getPublicAgentById = asyncHandler(async (req: Request, res: Response) => {
  const agent = await Agent.findById(req.params.id).populate({
    path: "properties",
    match: { status: "approved" },
    select: "title price type location images slug",
  });
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }
  res.json(agent);
});
