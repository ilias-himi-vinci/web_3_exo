import { useState, useEffect } from 'react';
import type { User } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://unknown-api-url.com';

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${host}/api/users`)
      .then((response) => response.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return { users };
}

export default useUsers;