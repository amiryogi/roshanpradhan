import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
}

export interface CloudinaryImage {
  url: string;
  publicId: string;
}
