import { Request, Response } from 'express';
import { Exhibition } from '../models/Exhibition';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { deleteFromCloudinary } from '../services/cloudinary.service';

export const getExhibitions = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const exhibitions = await Exhibition.find(filter).sort('-startDate');
    res.json(new ApiResponse('Exhibitions retrieved', exhibitions));
  }
);

export const getExhibitionById = asyncHandler(
  async (req: Request, res: Response) => {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) throw new ApiError(404, 'Exhibition not found');
    res.json(new ApiResponse('Exhibition retrieved', exhibition));
  }
);

export const createExhibition = asyncHandler(
  async (req: Request, res: Response) => {
    const exhibition = await Exhibition.create(req.body);
    res.status(201).json(new ApiResponse('Exhibition created', exhibition));
  }
);

export const updateExhibition = asyncHandler(
  async (req: Request, res: Response) => {
    const exhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exhibition) throw new ApiError(404, 'Exhibition not found');
    res.json(new ApiResponse('Exhibition updated', exhibition));
  }
);

export const deleteExhibition = asyncHandler(
  async (req: Request, res: Response) => {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) throw new ApiError(404, 'Exhibition not found');
    if (exhibition.coverImage?.publicId) {
      await deleteFromCloudinary(exhibition.coverImage.publicId);
    }
    await exhibition.deleteOne();
    res.json(new ApiResponse('Exhibition deleted'));
  }
);
