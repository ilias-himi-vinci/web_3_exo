import { useState } from 'react';
import type { User, Category } from '../types/Expense';

interface ExpenseFilterFormProps {
  users: User[];
  categories: Category[];
  onSearch: (query: string) => void;
}

function ExpenseFilterForm({ users, categories, onSearch }: ExpenseFilterFormProps) {
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (amount) params.set('amount', amount);
    if (payerId) params.set('payerId', payerId);
    if (categoryId) params.set('categoryId', categoryId);
    onSearch(params.toString());
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Montant minimum :
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label>
        Payeur :
        <select value={payerId} onChange={(e) => setPayerId(e.target.value)}>
          <option value="">Tous</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </label>

      <label>
        Catégorie :
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Toutes</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <button type="submit">Rechercher</button>
    </form>
  );
}

export default ExpenseFilterForm;