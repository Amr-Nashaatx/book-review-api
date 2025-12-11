import { StorageProvider } from "./storageProvider.js";
import cloudinary from "../../config/cloudinary.js";
import { Readable } from "stream";

export class CloudinaryProvider extends StorageProvider {
  uploadImage(buffer, folder) {
    if (!buffer) {
      throw new Error("File buffer is required");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [{ width: 600, height: 900, crop: "fill" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId) {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  }
}
