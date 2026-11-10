
import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';

function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${host}/api/expenses`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des dépenses');
      }

      const data: Expense[] = await response.json();

      setExpenses(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue';

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses]);

  async function addExpense(expense: Expense): Promise<void> {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${host}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la dépense");
      }

      await fetchExpenses();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue';

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function resetExpenses(): Promise<void> {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${host}/api/expenses/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation des dépenses');
      }

      await fetchExpenses();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue';

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    resetExpenses,
  };
}

export default useExpenses;
