import { Router } from 'express';
import {
  getRemissions,
  getRemissionById,
  createRemission,
  updateRemission,
  deleteRemission,
  downloadRemissionPDF,
  annulRemission,
} from '../controllers/remission.controller.js';

const router = Router();

router.get('/', getRemissions);
router.get('/:id', getRemissionById);
router.post('/', createRemission);
router.put('/:id', updateRemission);
router.delete('/:id', deleteRemission);
router.patch('/:id/annul', annulRemission);
router.get('/:id/pdf', downloadRemissionPDF);

export default router;
