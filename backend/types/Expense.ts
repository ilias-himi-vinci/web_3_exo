export type User = {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
};

export type Expense = {
  id: number;
  date: string;
  description: string;
  amount: number;
  payer: User;
  participants: User[];
};

export type NewExpense = {
  description: string;
  amount: number;
  payerId: number;
  participantIds: number[];
  date?: string;
};