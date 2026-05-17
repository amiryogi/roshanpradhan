import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const artworkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string().min(1),
  medium: z.string().min(1),
  dimensions: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().nullable().optional(),
  isForSale: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string() }))
    .min(1),
  tags: z.array(z.string()).optional(),
});

export const exhibitionSchema = z
  .object({
    title: z.string().min(1),
    venue: z.string().min(1),
    location: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    description: z.string().min(1),
    coverImage: z.object({ url: z.string().url(), publicId: z.string() }),
    type: z.enum(['solo', 'group']),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const aboutSchema = z.object({
  bio: z.string().optional(),
  statement: z.string().optional(),
  profileImage: z
    .object({ url: z.string().url(), publicId: z.string() })
    .optional(),
  cv: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});
