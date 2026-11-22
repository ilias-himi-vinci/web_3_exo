import { z } from 'zod';

export type User = {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
};

export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Expense = {
  id: number;
  date: string;
  description: string;
  amount: number;
  payer: User;
  participants: User[];
  category: Category | null;  
};

export type NewExpense = {
  description: string;
  amount: number;
  payerId: number;
  participantIds: number[];
  categoryId?: number | null;
  date?: string;
};

const emptyToUndefined = (v: unknown) => (v === '' ? undefined : v);

const expenseFilterSchema = z.object({
  amount: z.preprocess(emptyToUndefined, z.coerce.number().nonnegative().optional()),
  payerId: z.preprocess(emptyToUndefined, z.coerce.number().int().optional()),
  categoryId: z.preprocess(emptyToUndefined, z.coerce.number().int().optional()),
});

export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;

export function parseExpenseFilter(data: unknown): ExpenseFilter | false {
  const result = expenseFilterSchema.safeParse(data);
  return result.success ? result.data : false;
}