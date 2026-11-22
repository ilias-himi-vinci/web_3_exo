import { Router } from 'express';
import { getExpenses, addExpense, resetExpenses } from '../services/expenses.ts';
import { parseExpenseFilter } from '../types/Expense.ts';

const router = Router();

// GET : récupérer toutes les dépenses
router.get('/expenses', async (req, res) => {
  const filter = parseExpenseFilter(req.query);
  if (!filter) {
    return res.status(400).json({ message: 'Paramètres de recherche invalides' });
  }
  try {
    res.status(200).json(await getExpenses(filter));
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dépenses' });
  }
});

// POST : ajouter une dépense
router.post('/expenses', async (req, res) => {
  try {
    const expense = req.body;
    const newExpense = await addExpense(expense);
    res.status(201).json(newExpense);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la dépense",
    });
  }
});

// POST : réinitialiser les dépenses
router.post('/expenses/reset', async (req, res) => {
  try {
    const expenses = await resetExpenses();
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