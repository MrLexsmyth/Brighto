import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../src/models/Admin";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const adminExists = await Admin.findOne({
      email: "admin@estate.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "Super Admin",
      email: "admin@estate.com",
      password: "Admin@123", // hashed automatically
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
