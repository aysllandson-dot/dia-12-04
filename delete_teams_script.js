const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teamNames = ['beta 1', 'Videiras'];

async function main() {
  console.log('--- Deleting Teams ---');
  for (const name of teamNames) {
    try {
      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { name: name },
        include: { employees: true }
      });

      if (!team) {
        console.log(`Team "${name}" not found.`);
        continue;
      }

      // If there are employees, unassign them first (set teamId to null)
      if (team.employees.length > 0) {
        console.log(`Unassigning ${team.employees.length} employees from team "${name}"...`);
        await prisma.employee.updateMany({
          where: { teamId: team.id },
          data: { teamId: null }
        });
      }

      // Delete the team
      await prisma.team.delete({
        where: { id: team.id }
      });
      console.log(`Team "${name}" deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting team "${name}":`, error.message);
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
