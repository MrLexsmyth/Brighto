import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export type PropertyType = "land" | "apartment" | "house" | "commercial";
export type PropertyCategory = "sale" | "rent" | "shortlet";

export interface IProperty extends Document {
  title: string;
  description: string;

  type: PropertyType;
  category: PropertyCategory;

  price?: number;
  pricePerNight?: number;

  location: {
    address: string;      // Full address
    city: string;         // e.g., "Lagos"
    state: string;        // e.g., "Lagos State"
    area?: string;        // e.g., "Lekki", "Victoria Island"
    coordinates: {
      lat: number;
      lng: number;
    };
  };

  size?: string;

  bedrooms?: number;
  bathrooms?: number;

  images: string[];

  status: "pending" | "approved" | "rejected";

  agent: mongoose.Types.ObjectId;

  slug: string;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    type: {
      type: String,
      enum: ["land", "apartment", "house", "commercial"],
      required: true,
    },

    category: {
      type: String,
      enum: ["sale", "rent", "shortlet"],
      required: true,
    },

    price: Number,
    pricePerNight: Number,

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      area: String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },

    size: String,

    bedrooms: Number,
    bathrooms: Number,

    images: {
      type: [String],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Generate slug
propertySchema.pre("save", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Create index for geospatial queries (optional but useful for "near me" searches)
propertySchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model<IProperty>("Property", propertySchema);