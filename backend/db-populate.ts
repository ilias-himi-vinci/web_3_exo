import { db } from './src/prisma/db.ts';
import { readFileSync } from 'fs';

async function main() {
  const expenses = JSON.parse(readFileSync('./data/expenses.json', 'utf-8'));

  for (const e of expenses) {
    await db.orm.public.Expense.create({
      description: e.description,
      payer: e.payer,
      amount: e.amount,
    });
  }

  console.log(`${expenses.length} dépenses insérées`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });