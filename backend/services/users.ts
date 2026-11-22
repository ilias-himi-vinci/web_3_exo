import { db } from '../src/prisma/db.ts';
import type { User } from '../types/Expense.ts';

export async function getUsers(): Promise<User[]> {
  return (await db.orm.public.User.all()) as User[];
}