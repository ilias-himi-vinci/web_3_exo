import { Router } from 'express';
import { getCategories } from '../services/categories.ts';

const router = Router();

router.get('/categories', async (req, res) => {
  try {
    res.status(200).json(await getCategories());
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
  }
});

export default router;