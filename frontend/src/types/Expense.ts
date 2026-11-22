export type User = { id: number; name: string; email: string; bankAccount: string | null };

export type Category = { id: number; name: string; color: string };

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