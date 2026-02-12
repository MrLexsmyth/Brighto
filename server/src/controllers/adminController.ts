import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

/**
 * @desc    Register Admin (use once)
 * @route   POST /api/admin/register
 */
export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({ name, email, password });

  const token = generateToken(admin._id.toString());

  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
     token,
  });
});

/**
 * @desc    Admin Login
 * @route   POST /api/admin/login
 */
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(admin._id.toString());

  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
     token,
  });
});

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/logout
 */
export const logoutAdmin = (_req: Request, res: Response) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Admin logged out" });
};
