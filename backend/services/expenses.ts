import { readFileSync } from 'node:fs';
import type { Expense, ExpenseFilter, NewExpense, User, Category } from '../types/Expense.ts';
import { db } from '../src/prisma/db.ts';

const initialExpensesFile = new URL('../data/expenses.init.json', import.meta.url);

type RawExpense = {
  id: number;
  date: string;
  description: string;
  amount: number;
  payerId: number;
  categoryId: number | null;
};

// Assemble payer + participants à partir des tables User et Participations
async function hydrate(rows: RawExpense[]): Promise<Expense[]> {
  const users = (await db.orm.public.User.all()) as User[];
  const categories = (await db.orm.public.Category.all()) as Category[];   // nouveau
  const participations = (await db.orm.public.Participations.all()) as {
    expenseId: number;
    userId: number;
  }[];
  const usersById = new Map(users.map((u) => [u.id, u]));
  const categoriesById = new Map(categories.map((c) => [c.id, c]));        // nouveau

  return rows.map((e) => ({
    id: e.id,
    date: e.date,
    description: e.description,
    amount: e.amount,
    payer: usersById.get(e.payerId)!,
    participants: participations
      .filter((p) => p.expenseId === e.id)
      .map((p) => usersById.get(p.userId)!)
      .filter(Boolean),
    category: e.categoryId != null ? (categoriesById.get(e.categoryId) ?? null) : null,  // nouveau
  }));
}

export async function getExpenses(filter: ExpenseFilter = {}): Promise<Expense[]> {
  const rows = (await db.orm.public.Expense.all()) as RawExpense[];
  const filtered = rows.filter(
  (e) =>
    (filter.amount === undefined || e.amount >= filter.amount) &&
    (filter.payerId === undefined || e.payerId === filter.payerId) &&
    (filter.categoryId === undefined || e.categoryId === filter.categoryId),
);
  return hydrate(filtered);
}

export async function addExpense(expense: NewExpense): Promise<Expense> {
 const created = (await db.orm.public.Expense.create({
  description: expense.description,
  amount: expense.amount,
  payerId: expense.payerId,
  ...(expense.categoryId != null ? { categoryId: expense.categoryId } : {}),  // nouveau
  ...(expense.date ? { date: new Date(expense.date).toISOString() } : {}),
})) as RawExpense;

  // Une ligne de la table de jointure par participant
  for (const userId of new Set(expense.participantIds ?? [])) {
    await db.orm.public.Participations.create({
      expenseId: created.id,
      userId,
    });
  }

  const [result] = await hydrate([created]);
  return result;
}

export async function resetExpenses(): Promise<Expense[]> {
  // 1. Supprimer les dépenses (les Participations partent en cascade)
  const existing = (await db.orm.public.Expense.all()) as RawExpense[];
  for (const e of existing) {
    await db.orm.public.Expense.where({ id: e.id }).delete();
  }

  // 2. Réinsérer les données initiales (ancien format : payer = nom)
  const initial = JSON.parse(readFileSync(initialExpensesFile, 'utf-8')) as {
    description: string;
    payer: string;
    amount: number;
  }[];

  const users = (await db.orm.public.User.all()) as User[];
  for (const e of initial) {
    const payer = users.find((u) => u.name === e.payer);
    if (!payer) {
      throw new Error(`Utilisateur "${e.payer}" introuvable : lance db-populate.ts d'abord`);
    }
    await addExpense({
      description: e.description,
      amount: e.amount,
      payerId: payer.id,
      participantIds: users.map((u) => u.id), // tout le monde participe
    });
  }

  return getExpenses();
}