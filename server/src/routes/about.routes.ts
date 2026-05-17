import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/about.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { aboutSchema } from '../validators/schemas';

const router = Router();

router.get('/', getAbout);
router.put('/', protect, adminOnly, validate(aboutSchema), updateAbout);

export default router;
