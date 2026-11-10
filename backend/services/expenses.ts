import { readFileSync, writeFileSync } from 'node:fs';
import type { Expense } from '../types/Expense.ts';

const expensesFile = new URL('../data/expenses.json', import.meta.url);
const initialExpensesFile = new URL('../data/expenses.init.json', import.meta.url);

export function getAllExpenses(): Expense[] {
  const data = readFileSync(expensesFile, 'utf-8');
  return JSON.parse(data) as Expense[];
}

export function addExpense(expense: Expense): Expense {
  const expenses = getAllExpenses();

  expenses.push(expense);

  writeFileSync(
    expensesFile,
    JSON.stringify(expenses, null, 2),
    'utf-8',
  );

  return expense;
}

export function resetExpenses(): Expense[] {
  const data = readFileSync(initialExpensesFile, 'utf-8');

  const initialExpenses = JSON.parse(data) as Expense[];

  writeFileSync(
    expensesFile,
    JSON.stringify(initialExpenses, null, 2),
    'utf-8',
  );

  return initialExpenses;
}