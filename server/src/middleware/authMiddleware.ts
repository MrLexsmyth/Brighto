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
    console.log("🔐 x-auth-token:", req.headers['x-auth-token']);
    console.log("🔐 Cookies:", req.cookies);
    
    let token;

    // Check custom header first (for mobile)
    if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'] as string;
      console.log("🔐 Token found in x-auth-token header");
    }
    // Check Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔐 Token found in Authorization header");
    }
    // Fallback to cookie (desktop)
    else if (req.cookies.adminToken) {
      token = req.cookies.adminToken;
      console.log("🔐 Token found in cookies");
    }
    
    if (!token) {
      console.log("❌ No token found in cookies or Authorization header");
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
        res.status(401);
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