import { Router } from 'express';
import { searchInventory } from '../controllers/inventory.controller.js';

const router = Router();

router.get('/search', searchInventory);

export default router;
