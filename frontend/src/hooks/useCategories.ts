import { useState, useEffect } from 'react';
import type { Category } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then((response) => response.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return { categories };
}

export default useCategories;