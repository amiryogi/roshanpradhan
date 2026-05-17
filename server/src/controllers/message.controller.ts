import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const message = await Message.create(req.body);
    res.status(201).json(new ApiResponse('Message sent', message));
  }
);

export const getMessages = asyncHandler(
  async (_req: Request, res: Response) => {
    const messages = await Message.find().sort('-createdAt');
    res.json(new ApiResponse('Messages retrieved', messages));
  }
);

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!message) throw new ApiError(404, 'Message not found');
  res.json(new ApiResponse('Marked as read', message));
});

export const deleteMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found');
    res.json(new ApiResponse('Message deleted'));
  }
);
