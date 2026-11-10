import { Router } from 'express';
import {
  getAllExpenses,
  addExpense,
  resetExpenses,
} from '../services/expenses.ts';

const router = Router();

// GET : récupérer toutes les dépenses
router.get('/expenses', (req, res) => {
  try {
    const expenses = getAllExpenses();
    res.status(200).json(expenses);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des dépenses',
    });
  }
});

// POST : ajouter une dépense
router.post('/expenses', (req, res) => {
  try {
    const expense = req.body;
    const newExpense = addExpense(expense);
    res.status(201).json(newExpense);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la dépense",
    });
  }
});

// POST : réinitialiser les dépenses
router.post('/expenses/reset', (req, res) => {
  try {
    const expenses = resetExpenses();

    res.status(200).json({
      message: 'Dépenses réinitialisées avec succès',
      expenses: expenses,
    });
  } catch (error: unknown) {
    console.error(error);

    res.status(500).json({
      message: 'Erreur lors de la réinitialisation des dépenses',
    });
  }
});

export default router;