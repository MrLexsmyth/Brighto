// server/src/models/Blog.ts
import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: string;
  images?: string[];
  categories?: string[];
  tags?: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    images: [{ type: String }],
    categories: [{ type: String }],
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from title
blogSchema.pre<IBlog>("validate", function (next) {
  if (this.title && !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    this.slug = baseSlug;
  }
  next();
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
