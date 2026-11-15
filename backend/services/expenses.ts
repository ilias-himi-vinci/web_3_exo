import { readFileSync } from 'node:fs';
import type { Expense } from '../types/Expense.ts';
import { db } from '../src/prisma/db.ts';

const initialExpensesFile = new URL('../data/expenses.init.json', import.meta.url);

type NewExpense = Omit<Expense, 'id' | 'date'>;

export async function getAllExpenses(): Promise<Expense[]> {
  const expenses = await db.orm.public.Expense.all();
  return expenses as Expense[];
}

export async function addExpense(expense: NewExpense): Promise<Expense> {
  const created = await db.orm.public.Expense.create({
    description: expense.description,
    payer: expense.payer,
    amount: expense.amount,
  });
  return created as Expense;
}

export async function resetExpenses(): Promise<Expense[]> {
  // 1. Supprimer toutes les dépenses existantes, une par une
  const existing = await db.orm.public.Expense.all();
  for (const e of existing) {
    await db.orm.public.Expense.where({ id: e.id }).delete();
  }

  // 2. Réinsérer les données initiales
  const initial = JSON.parse(
    readFileSync(initialExpensesFile, 'utf-8'),
  ) as NewExpense[];

  for (const e of initial) {
    await db.orm.public.Expense.create({
      description: e.description,
      payer: e.payer,
      amount: e.amount,
    });
  }

  return await getAllExpenses();
}