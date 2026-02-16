import express, { Response } from "express";
import { protect, AdminRequest } from "../middleware/authMiddleware";
import { registerAdmin, loginAdmin, logoutAdmin  } from "../controllers/adminController";

const router = express.Router();

// Public
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", protect, logoutAdmin);


// Protected
router.get("/dashboard", protect, (req: AdminRequest, res: Response) => {
  res.json({
    message: "Welcome Admin",
    admin: req.admin, 
  });
});

export default router;
