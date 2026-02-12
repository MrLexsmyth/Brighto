import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

console.log(" Cloudinary loaded:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✔️" : "❌",
  secret: process.env.CLOUDINARY_API_SECRET ? "✔️" : "❌",
});


export const uploadToCloudinary = (
  buffer: Buffer,
  folder = "properties"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("❌ CLOUDINARY ERROR:", error);
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary returned no URL"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};
