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
    console.log("🔐 Query token:", req.query.token);
    console.log("🔐 x-auth-token:", req.headers['x-auth-token']);
    console.log("🔐 Cookies:", req.cookies);
    
   let token;

// Check request body first (for POST requests)
if (req.body && req.body.token) {
  token = req.body.token as string;
  console.log("🔐 Token found in request body");
}
// Check query parameter (for GET with iOS)
else if (req.query.token) {
  token = req.query.token as string;
  console.log("🔐 Token found in query parameter");
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