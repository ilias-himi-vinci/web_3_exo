import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="expense-item">
      <p>Date : {expense.date}</p>
      <p>Description : {expense.description}</p>
      <p>Payé par : {expense.payer}</p>
      <p>Montant : ${expense.amount.toFixed(2)}</p>
    </div>
  );
}

export default ExpenseItem;