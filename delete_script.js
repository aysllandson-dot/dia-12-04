const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const namesToDelete = [
  'A. Carlos',
  'Test Delete',
  'sup v',
  't 4',
  't 5',
  'teste 1',
  'teste 2',
  'teste 3'
];

async function main() {
  console.log('--- Deleting Employees ---');
  for (const name of namesToDelete) {
    try {
      const deleted = await prisma.employee.deleteMany({
        where: {
          fullName: name
        }
      });
      console.log(`Deleted ${deleted.count} records for: ${name}`);
    } catch (error) {
      console.error(`Error deleting ${name}:`, error.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
