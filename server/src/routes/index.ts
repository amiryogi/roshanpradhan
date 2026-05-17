import { Router } from 'express';
import authRoutes from './auth.routes';
import artworkRoutes from './artwork.routes';
import exhibitionRoutes from './exhibition.routes';
import aboutRoutes from './about.routes';
import messageRoutes from './message.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/artworks', artworkRoutes);
router.use('/exhibitions', exhibitionRoutes);
router.use('/about', aboutRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);

export default router;
