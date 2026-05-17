import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { CloudinaryImage } from '../types';

export interface IArtwork extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number | null;
  isForSale: boolean;
  isFeatured: boolean;
  images: CloudinaryImage[];
  tags: string[];
}

const artworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    medium: { type: String, required: true },
    dimensions: { type: String, default: '' },
    year: { type: Number, required: true },
    price: { type: Number, default: null },
    isForSale: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false, index: true },
    images: [{ url: String, publicId: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

artworkSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      '-' +
      Date.now().toString(36);
  }
  next();
});

export const Artwork = mongoose.model<IArtwork>('Artwork', artworkSchema);
