import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../services/token.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.json(
    new ApiResponse('Login successful', {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  );
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse('Current user', user));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json(new ApiResponse('Logged out'));
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };
  const user = await User.findById(req.user?.id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  res.json(new ApiResponse('Password updated successfully'));
});
