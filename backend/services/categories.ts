import { db } from '../src/prisma/db.ts';
import type { Category } from '../types/Expense.ts';

export async function getCategories(): Promise<Category[]> {
  return (await db.orm.public.Category.all()) as Category[];
}