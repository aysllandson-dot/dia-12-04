const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const names = ['A. Carlos', 'Test Delete', 'sup v', 't 4', 't 5', 'teste 1', 'teste 2', 'teste 3'];
  const count = await prisma.employee.count({
    where: {
      fullName: { in: names }
    }
  });
  console.log('--- RE-VERIFICATION ---');
  console.log('Number of target names found in DB:', count);
}

main().finally(() => prisma.$disconnect());
