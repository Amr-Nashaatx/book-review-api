import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = async (
  fileBuffer: any,
  folder: string,
): Promise<any> => {
  if (!fileBuffer) {
    throw new Error("File buffer is required");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 600, height: 900, crop: "fill" }],
      },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};
