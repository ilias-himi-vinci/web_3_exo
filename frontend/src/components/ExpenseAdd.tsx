import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NewExpense } from '../types/Expense';

const expenseSchema = z.object({
  payer: z.enum(['Alice', 'Bob'], {
    error: 'Le payeur doit être Alice ou Bob',
  }),
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
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { payer: 'Alice' },
  });

  async function onSubmit(data: ExpenseFormData) {
    const newExpense: NewExpense = {
      payer: data.payer,
      date: data.date,
      description: data.description ?? '',
      amount: data.amount,
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
        <select {...register('payer')}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
        {errors.payer && <span>{errors.payer.message}</span>}
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