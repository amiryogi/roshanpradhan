import { Router } from 'express';
import {
  getExhibitions,
  getExhibitionById,
  createExhibition,
  updateExhibition,
  deleteExhibition,
} from '../controllers/exhibition.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { exhibitionSchema } from '../validators/schemas';

const router = Router();

router.get('/', getExhibitions);
router.get('/:id', getExhibitionById);
router.post('/', protect, adminOnly, validate(exhibitionSchema), createExhibition);
router.put('/:id', protect, adminOnly, updateExhibition);
router.delete('/:id', protect, adminOnly, deleteExhibition);

export default router;
