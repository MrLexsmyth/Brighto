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

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 🔍 DEBUGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log("\n" + "=".repeat(50));
  console.log(`📨 ${req.method} ${req.path}`);
  console.log("📨 Full URL:", req.originalUrl);
  console.log("📨 Content-Type:", req.headers["content-type"]);
  console.log("📨 Cookies:", req.cookies);
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
    console.log(" MongoDB connected");

    // Connect Redis
    await connectRedis();

    // Start Express server
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
