import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="expense-item">
      <p>Date : {expense.date}</p>
      <p>Description : {expense.description}</p>
      <p>Payé par : {expense.payer.name}</p>
      <p>Montant : ${expense.amount.toFixed(2)}</p>
    {expense.category && (
      <span
        style={{
          backgroundColor: expense.category.color,
          color: 'white',
          padding: '2px 8px',
          borderRadius: 8,
        }}
      >
        {expense.category.name}
      </span>
    )}
    </div>
  );
}

export default ExpenseItem;