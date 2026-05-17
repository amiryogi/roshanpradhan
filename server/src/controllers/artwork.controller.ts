import { Request, Response } from 'express';
import { Artwork } from '../models/Artwork';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { deleteFromCloudinary } from '../services/cloudinary.service';

export const getArtworks = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, search, page = 1, limit = 12 } = req.query;
  const filter: Record<string, unknown> = {};

  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [artworks, total] = await Promise.all([
    Artwork.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    Artwork.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse('Artworks retrieved', {
      artworks,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  );
});

export const getArtworkBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const artwork = await Artwork.findOne({ slug: req.params.slug });
    if (!artwork) throw new ApiError(404, 'Artwork not found');
    res.json(new ApiResponse('Artwork retrieved', artwork));
  }
);

export const createArtwork = asyncHandler(
  async (req: Request, res: Response) => {
    const artwork = await Artwork.create(req.body);
    res.status(201).json(new ApiResponse('Artwork created', artwork));
  }
);

export const updateArtwork = asyncHandler(
  async (req: Request, res: Response) => {
    const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artwork) throw new ApiError(404, 'Artwork not found');
    res.json(new ApiResponse('Artwork updated', artwork));
  }
);

export const deleteArtwork = asyncHandler(
  async (req: Request, res: Response) => {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) throw new ApiError(404, 'Artwork not found');

    // Cleanup Cloudinary images
    await Promise.all(
      artwork.images.map((img) => deleteFromCloudinary(img.publicId))
    );
    await artwork.deleteOne();

    res.json(new ApiResponse('Artwork deleted'));
  }
);
