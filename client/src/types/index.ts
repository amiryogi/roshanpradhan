export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export interface Artwork {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Exhibition {
  _id: string;
  title: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImage: CloudinaryImage;
  type: 'solo' | 'group';
  status: 'upcoming' | 'ongoing' | 'past';
  createdAt: string;
}

export interface About {
  _id: string;
  bio: string;
  statement: string;
  profileImage?: CloudinaryImage;
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

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  artworks: T[];
  total: number;
  page: number;
  totalPages: number;
}
