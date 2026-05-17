import { Router } from 'express';
import {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from '../controllers/message.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { messageSchema } from '../validators/schemas';
import rateLimit from 'express-rate-limit';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many messages sent. Try again later.',
});

router.post('/', contactLimiter, validate(messageSchema), createMessage);
router.get('/', protect, adminOnly, getMessages);
router.patch('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
