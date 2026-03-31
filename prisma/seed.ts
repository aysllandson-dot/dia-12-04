import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  // Seed User (Admin)
  const user = await prisma.user.upsert({
    where: { email: 'admin@vianamoura.com.br' },
    update: {},
    create: {
      email: 'admin@vianamoura.com.br',
      name: 'Supervisor Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  
  console.log('Seeded User:', user.email)

  // Fictional Employees Data
  const employeesData = [
    { fullName: "João Silva", role: "Servente", sector: "Produção", gender: "Masculino", status: "Ativo" },
    { fullName: "Maria Oliveira", role: "Polivalente", sector: "Infra", gender: "Feminino", status: "Ativo" },
    { fullName: "Pedro Santos", role: "Operador", sector: "UDE", gender: "Masculino", status: "Ativo" },
    { fullName: "Ana Costa", role: "Operador Lider", sector: "Suprimentos", gender: "Feminino", status: "Ativo" },
    { fullName: "Lucas Lima", role: "Supervisor", sector: "Produção", gender: "Masculino", status: "Ativo" },
    { fullName: "Carla Souza", role: "Servente", sector: "Infra", gender: "Feminino", status: "Ativo" },
    { fullName: "Marcos Ferreira", role: "Polivalente", sector: "UDE", gender: "Masculino", status: "Ativo" },
    { fullName: "Julia Rocha", role: "Operador", sector: "Produção", gender: "Feminino", status: "Ativo" },
    { fullName: "Felipe Almeida", role: "Operador Lider", sector: "Infra", gender: "Masculino", status: "Ativo" },
    { fullName: "Beatriz Nunes", role: "Servente", sector: "Suprimentos", gender: "Feminino", status: "Ativo" },
  ];

  console.log('Seeding employees and evaluations...')

  for (const emp of employeesData) {
    const createdEmployee = await prisma.employee.upsert({
      where: { id: `seed-${emp.fullName.toLowerCase().replace(/ /g, '-')}` },
      update: emp,
      create: {
        id: `seed-${emp.fullName.toLowerCase().replace(/ /g, '-')}`,
        ...emp,
        admissionDate: new Date(),
      }
    });

    // Create a fictional evaluation for each
    const punctuality = Math.floor(Math.random() * 3) + 3; // 3-5
    const organization = Math.floor(Math.random() * 3) + 3;
    const knowledge = Math.floor(Math.random() * 3) + 3;
    const proactivity = Math.floor(Math.random() * 3) + 3;
    const commitment = Math.floor(Math.random() * 3) + 3;
    const average = (punctuality + organization + knowledge + proactivity + commitment) / 5;

    await prisma.evaluation.create({
      data: {
        employeeId: createdEmployee.id,
        supervisorId: user.id,
        punctuality,
        organization,
        knowledge,
        proactivity,
        commitment,
        average,
      }
    });
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
