import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NewExpense, User, Category } from '../types/Expense';

const expenseSchema = z.object({
  payerId: z.number({ error: 'Choisissez un payeur' }),
  categoryId: z.number({ error: 'Choisissez une catégorie' }),
  date: z.string().min(1, 'La date est obligatoire'),
  description: z
    .string()
    .max(200, 'La description ne peut pas dépasser 200 caractères')
    .optional(),
  amount: z
    .number({ error: 'Le montant doit être un nombre' })
    .positive('Le montant doit être strictement positif'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => Promise<void>;
  users: User[];
  categories: Category[];
}

function ExpenseAdd({ addExpense, users, categories }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  async function onSubmit(data: ExpenseFormData) {
    const newExpense: NewExpense = {
      payerId: data.payerId,
      categoryId: data.categoryId,
      date: data.date,
      description: data.description ?? '',
      amount: data.amount,
      participantIds: users.map((u) => u.id), // tout le monde participe
    };

    try {
      await addExpense(newExpense);
      reset();
    } catch {
      // l'erreur est déjà affichée par le hook useExpenses
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Payé par :
        <select {...register('payerId', { valueAsNumber: true })}>
          <option value="">-- Choisir --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        {errors.payerId && <span>{errors.payerId.message}</span>}
      </label>

      <label>
        Catégorie :
        <select {...register('categoryId', { valueAsNumber: true })}>
          <option value="">-- Choisir --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <span>{errors.categoryId.message}</span>}
      </label>

      <label>
        Date :
        <input type="date" {...register('date')} />
        {errors.date && <span>{errors.date.message}</span>}
      </label>

      <label>
        Description :
        <input type="text" {...register('description')} />
        {errors.description && <span>{errors.description.message}</span>}
      </label>

      <label>
        Montant :
        <input
          type="number"
          step="0.01"
          placeholder="Entrez le montant"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && <span>{errors.amount.message}</span>}
      </label>

      <button type="submit">Ajouter</button>
    </form>
  );
}

export default ExpenseAdd;