import mongoose, { Document, Schema } from 'mongoose';
import { CloudinaryImage } from '../types';

export interface IExhibition extends Document {
  title: string;
  venue: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  coverImage: CloudinaryImage;
  type: 'solo' | 'group';
  status: 'upcoming' | 'ongoing' | 'past';
}

const exhibitionSchema = new Schema<IExhibition>(
  {
    title: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    coverImage: { url: String, publicId: String },
    type: { type: String, enum: ['solo', 'group'], default: 'solo' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'past'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

// Auto-compute status before save
exhibitionSchema.pre('save', function (next) {
  const now = new Date();
  if (now < this.startDate) this.status = 'upcoming';
  else if (now > this.endDate) this.status = 'past';
  else this.status = 'ongoing';
  next();
});

export const Exhibition = mongoose.model<IExhibition>(
  'Exhibition',
  exhibitionSchema
);
