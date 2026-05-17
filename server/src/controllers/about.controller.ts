import { Request, Response } from 'express';
import { About } from '../models/About';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getAbout = asyncHandler(async (_req: Request, res: Response) => {
  let about = await About.findOne();
  if (!about) about = await About.create({});
  res.json(new ApiResponse('About retrieved', about));
});

export const updateAbout = asyncHandler(
  async (req: Request, res: Response) => {
    const about = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(new ApiResponse('About updated', about));
  }
);
