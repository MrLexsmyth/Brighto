import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  name: string;
  title?: string;
  company?: string;
  serviceAreas?: string[];
  specialties?: string[];
  propertyTypes?: { type: string; percentage: number }[];
  propertyStatus?: { status: string; percentage: number }[];
  propertyCities?: { city: string; percentage: number }[];
  bio?: string;
  phone?: string;
  email?: string;
  website?: string;
  photo?: string;
  properties: mongoose.Types.ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String }, 
    company: { type: String },

    serviceAreas: [{ type: String }], // e.g., ["Island", "Lagos"]
    specialties: [{ type: String }], // e.g., ["Consulting", "Buyer's Agent", "Listing Agent"]

    propertyTypes: [{ type: String }], // e.g., ["Apartment", "House", "Land"]


    propertyStatus: [
      {
        status: { type: String }
        
      },
    ],

    propertyCities: [
      {
        city: { type: String } 
      },
    ],

    bio: { type: String, maxlength: 2000 },
    phone: { type: String },
    email: { type: String, lowercase: true },
    website: { type: String },
    photo: { type: String },

    properties: [
      { type: Schema.Types.ObjectId, ref: "Property" }, // links to Property collection
    ],

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IAgent>("Agent", AgentSchema);
