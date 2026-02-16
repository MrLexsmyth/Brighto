import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../src/models/Property";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // find docs where location is still a string
    const properties = await Property.find({
      location: { $type: "string" },
    });

    console.log(`Found ${properties.length} properties to migrate`);

    for (const prop of properties) {
      const oldLocation = prop.location as unknown as string;

      prop.location = {
        address: oldLocation || "Unknown address",
        city: "Lagos",          // you can customize later
        state: "Lagos",
        area: oldLocation || "",
        coordinates: {
          lat: 6.4698,          // temporary default
          lng: 3.5852,
        },
      } as any;

      await prop.save();
    }

    console.log("Migration completed ✅");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed ❌", error);
    process.exit(1);
  }
}

migrate();
