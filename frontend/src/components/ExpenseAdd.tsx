import { useForm } from 'react-hook-form';
import type { NewExpense } from '../types/Expense';

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => Promise<void>;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewExpense>({
    defaultValues: { payer: 'Alice' },
  });

  async function onSubmit(data: NewExpense) {
    try {
      await addExpense(data);
      reset();
    } catch {
      // l'erreur est déjà affichée par le hook useExpenses
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Payé par :
        <select {...register('payer', { required: true })}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>

      <label>
        Date :
        <input type="date" {...register('date', { required: true })} />
        {errors.date && <span>La date est obligatoire</span>}
      </label>

      <label>
        Description :
        <input type="text" {...register('description')} />
      </label>

      <label>
        Montant :
        <input
          type="number"
          step="0.01"
          placeholder="Entrez le montant"
          {...register('amount', { required: true, valueAsNumber: true })}
        />
        {errors.amount && <span>Le montant est obligatoire</span>}
      </label>

      <button type="submit">Ajouter</button>
    </form>
  );
}

export default ExpenseAdd;