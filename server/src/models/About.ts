import mongoose, { Document, Schema } from 'mongoose';
import { CloudinaryImage } from '../types';

export interface IAbout extends Document {
  bio: string;
  statement: string;
  profileImage: CloudinaryImage;
  cv: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  email: string;
  phone: string;
}

const aboutSchema = new Schema<IAbout>(
  {
    bio: { type: String, default: '' },
    statement: { type: String, default: '' },
    profileImage: { url: String, publicId: String },
    cv: { type: String, default: '' },
    socialLinks: {
      instagram: String,
      twitter: String,
      facebook: String,
      linkedin: String,
    },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
);

export const About = mongoose.model<IAbout>('About', aboutSchema);
