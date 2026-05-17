import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary';
import { CloudinaryImage } from '../types';

export const uploadToCloudinary = (
  buffer: Buffer,
  folder = 'artist-portfolio'
): Promise<CloudinaryImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
