import { Router } from 'express';
import {
  getArtworks,
  getArtworkBySlug,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from '../controllers/artwork.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { artworkSchema } from '../validators/schemas';

const router = Router();

router.get('/', getArtworks);
router.get('/:slug', getArtworkBySlug);
router.post('/', protect, adminOnly, validate(artworkSchema), createArtwork);
router.put('/:id', protect, adminOnly, updateArtwork);
router.delete('/:id', protect, adminOnly, deleteArtwork);

export default router;
