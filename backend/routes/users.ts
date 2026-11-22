import { Router } from 'express';
import { getUsers } from '../services/users.ts';

const router = Router();

router.get('/users', async (req, res) => {
  try {
    res.status(200).json(await getUsers());
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

export default router;