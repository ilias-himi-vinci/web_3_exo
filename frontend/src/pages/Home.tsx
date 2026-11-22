import { useState } from 'react';
import useExpenses from '../hooks/useExpenses';
import ExpenseItem from '../components/ExpenseItem';
import ExpenseAdd from '../components/ExpenseAdd';
import ExpenseFilterForm from '../components/ExpenseFilterForm';
import './Home.css';
import useUsers from '../hooks/useUsers';
import useCategories from '../hooks/useCategories';



function Home() {
  const [query, setQuery] = useState('');
  const { expenses, loading, error, addExpense, resetExpenses } = useExpenses(query);
  const { users } = useUsers();
  const { categories } = useCategories();


  const [message, setMessage] = useState('');

  async function handleReset() {
    await resetExpenses();
    setMessage('Les dépenses ont été réinitialisées !');
  }

  return (
    <div className="home">
      <h1>Partage des dépenses</h1>

      <h2>Rechercher</h2>
      <ExpenseFilterForm users={users} categories={categories} onSearch={setQuery} />

      <ExpenseAdd addExpense={addExpense} users={users} categories={categories} />
      <button onClick={handleReset}>Réinitialiser les données</button>

      <h2>Liste des dépenses</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}
      {loading && <p>Chargement des dépenses...</p>}
      {!loading && expenses.length === 0 && <p>Aucune dépense trouvée.</p>}

      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}

export default Home;