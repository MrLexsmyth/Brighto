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

  location: string;
  address?: string;
  size?: string;

  bedrooms?: number;
  bathrooms?: number;

  images: string[];

  status: "pending" | "approved" | "rejected";

  agent: mongoose.Types.ObjectId; // ← FIXED NAME

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

    location: { type: String, required: true },
    address: String,
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

export default mongoose.model<IProperty>("Property", propertySchema);
