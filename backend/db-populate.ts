import { readFileSync } from 'node:fs';
import { db } from './src/prisma/db.ts';

type User = { id: number; name: string; email: string };

const USERS = [
  { name: 'Alice', email: 'alice@example.com', bankAccount: 'BE68 5390 0754 7034' },
  { name: 'Bob', email: 'bob@example.com', bankAccount: null },
  { name: 'Charlie', email: 'charlie@example.com', bankAccount: null },
];

async function main() {
  // 1. Utilisateurs (email unique : on ne recrée pas ceux qui existent)
  const existingUsers = (await db.orm.public.User.all()) as User[];
  for (const u of USERS) {
    if (!existingUsers.some((e) => e.email === u.email)) {
      await db.orm.public.User.create(u);
    }
  }
  const users = (await db.orm.public.User.all()) as User[];
  const byName = new Map(users.map((u) => [u.name, u]));

  // 2. Dépenses + participants
  const expenses = JSON.parse(readFileSync('./data/expenses.json', 'utf-8')) as {
    description: string;
    payer: string;
    amount: number;
  }[];

  for (const e of expenses) {
    const payer = byName.get(e.payer);
    if (!payer) throw new Error(`Payeur inconnu : ${e.payer}`);

    const created = (await db.orm.public.Expense.create({
      description: e.description,
      amount: e.amount,
      payerId: payer.id,
    })) as { id: number };

    for (const u of users) {
      await db.orm.public.Participations.create({
        expenseId: created.id,
        userId: u.id,
      });
    }
  }

  // 3. Quelques virements
  const alice = byName.get('Alice')!;
  const bob = byName.get('Bob')!;
  const charlie = byName.get('Charlie')!;
  await db.orm.public.Transfer.create({ amount: 20, sourceId: bob.id, targetId: alice.id });
  await db.orm.public.Transfer.create({ amount: 12.5, sourceId: charlie.id, targetId: alice.id });

  console.log(`${users.length} utilisateurs, ${expenses.length} dépenses, 2 transferts`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });