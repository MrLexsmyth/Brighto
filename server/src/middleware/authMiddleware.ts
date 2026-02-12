// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export interface AdminRequest extends Request {
  admin?: any; // can be refined to AdminDocument type
}

export const protect = asyncHandler(
  async (req: AdminRequest, res: Response, next: NextFunction) => {
    console.log("🔐 Protect middleware started");
    console.log("🔐 Cookies:", req.cookies);
    
    const token = req.cookies.adminToken;
    
    if (!token) {
      console.log("❌ No token found in cookies");
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    console.log("🔐 Token found:", token.substring(0, 20) + "...");

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("🔐 Token decoded, admin ID:", decoded.id);
      
      const admin = await Admin.findById(decoded.id);
      
      if (!admin) {
        console.log("❌ Admin not found in database");
        throw new Error("Admin not found");
      }

      console.log("✅ Admin authenticated:", admin._id);
      req.admin = admin;
      next();
      
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);