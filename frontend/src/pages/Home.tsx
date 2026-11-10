import { useState } from 'react';
import useExpenses from '../hooks/useExpenses';
import ExpenseItem from '../components/ExpenseItem';
import ExpenseAdd from '../components/ExpenseAdd';
import './Home.css';

function Home() {
  const {
    expenses,
    loading,
    error,
    addExpense,
    resetExpenses,
  } = useExpenses();

  const [message, setMessage] = useState('');

  async function handleReset() {
    await resetExpenses();
    setMessage('Les dépenses ont été réinitialisées !');
  }

  if (loading && expenses.length === 0) {
    return <p>Chargement des dépenses...</p>;
  }

  return (
    <div className="home">
      <h1>Partage des dépenses</h1>

      <h2>Liste des dépenses</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {message && <p>{message}</p>}

      <ExpenseAdd addExpense={addExpense} />

      <button onClick={handleReset}>
        Réinitialiser les données
      </button>

      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}

export default Home;