import { db } from './src/prisma/db.ts';

const CATEGORIES = [
  { name: 'Nourriture', color: '#f97316' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Loisirs', color: '#22c55e' },
];

async function main() {
  const existing = (await db.orm.public.Category.all()) as { name: string }[];

  for (const c of CATEGORIES) {
    if (!existing.some((e) => e.name === c.name)) {
      await db.orm.public.Category.create(c);
    }
  }

  console.log('Catégories OK');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });