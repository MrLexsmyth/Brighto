import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectRedis } from "./config/redis";

import adminRoutes from "./routes/adminRoutes";
import adminPropertyRoutes from "./routes/adminPropertyRoutes";
import publicPropertyRoutes from "./routes/publicPropertyRoutes";
import adminBlogRoutes from "./routes/adminBlogRoutes";
import publicBlogRoutes from "./routes/publicBlogRoutes";
import agentRoutes from "./routes/agentRoutes";
import adminAgentRoutes from "./routes/agentRoutes";

const app = express();

// App initialized successfully

// ================= TRUST PROXY (CRITICAL FOR RENDER) =================
app.set("trust proxy", 1); // Trust first proxy - required for Render

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= CORS (UPDATED FOR CROSS-ORIGIN COOKIES) =================
const allowedOrigins = [
  "http://localhost:3000", // Development
  process.env.FRONTEND_URL, // Production Vercel URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ CRITICAL: Allows cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // Cache preflight requests for 24 hours
  })
);

// Handle preflight requests explicitly
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 🔍 DEBUGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log("\n" + "=".repeat(50));
  console.log(`📨 ${req.method} ${req.path}`);
  console.log("📨 Full URL:", req.originalUrl);
  console.log("📨 Origin:", req.headers.origin);
  console.log("📨 Content-Type:", req.headers["content-type"]);
  console.log("📨 Cookies:", req.cookies);
  console.log("📨 Secure:", req.secure);
  console.log("📨 Protocol:", req.protocol);
  next();
});

// ================= ROUTES =================
app.use("/api/admin", adminRoutes);
app.use("/api/admin/properties", adminPropertyRoutes);
app.use("/api/properties", publicPropertyRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/blogs", publicBlogRoutes);
app.use("/api/admin/agents", agentRoutes);
app.use("/api/agents", agentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    corsOrigins: allowedOrigins,
  });
});

// ================= ERROR HANDLER =================
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("\n" + "❌".repeat(25));
    console.error("❌ ERROR CAUGHT:");
    console.error("❌ Message:", err.message);
    console.error("❌ Stack:", err.stack);
    console.error("❌".repeat(25) + "\n");

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }
);

// ================= DATABASE + REDIS + SERVER START =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");

    // Connect Redis
    await connectRedis();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV}`);
      console.log(`✅ Allowed Origins:`, allowedOrigins);
      console.log(`✅ Trust Proxy: Enabled`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();