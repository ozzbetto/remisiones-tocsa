import { Request, Response } from 'express';
import { inventoryService } from '../services/inventory.service.js';

export const searchInventory = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const assets = await inventoryService.searchComputers(q as string);
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ message: 'Error searching in inventory', error: error.message });
  }
};
