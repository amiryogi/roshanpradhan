import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);
router.delete('/:publicId', protect, adminOnly, deleteImage);

export default router;
