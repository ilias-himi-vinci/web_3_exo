import type { Expense } from "../types/Expense";


interface ExpenseAddProps {
  addExpense: (expense: Expense) => void;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {

  function handleAddClick() {

    const id = Date.now().toString();
    const payers = ['Alice', 'Bob'];
    const randomPayer = payers[Math.floor(Math.random() * payers.length)];
    const randomAmount = Math.round(Math.random() * 10000) / 100;

    const newExpense: Expense = {
      id: id,
      date: new Date().toISOString().split('T')[0],
      description: `Nouvelle dépense ${id}`,
      payer: randomPayer,
      amount: randomAmount,
    };
    addExpense(newExpense);
  }


  return (
    <div>
      <button onClick={handleAddClick}>Ajouter une dépense aléatoire</button>
    </div>
  );
}

export default ExpenseAdd;  
