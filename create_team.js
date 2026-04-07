const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newTeam = await prisma.team.create({
    data: {
      name: 'Equipe Alpha',
      sector: 'Geral'
    }
  });
  console.log('--- Team Created ---');
  console.log(`ID: ${newTeam.id}`);
  console.log(`Name: ${newTeam.name}`);
  console.log(`Sector: ${newTeam.sector}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
