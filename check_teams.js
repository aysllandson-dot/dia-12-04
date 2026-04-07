const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany();
  console.log('--- Current Teams ---');
  console.log(JSON.stringify(teams, null, 2));
}

main().finally(() => prisma.$disconnect());
