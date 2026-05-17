import { Request, Response } from 'express';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../services/cloudinary.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const uploadImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');
    const result = await uploadToCloudinary(req.file.buffer);
    res.json(new ApiResponse('Image uploaded', result));
  }
);

export const deleteImage = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteFromCloudinary(req.params.publicId as string);
    res.json(new ApiResponse('Image deleted'));
  }
);
