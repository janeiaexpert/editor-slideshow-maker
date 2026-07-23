import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.student.findUnique({
    where: { email: "joao@exemplo.com" },
  });

  if (existing) {
    console.log("Aluno já existe. ID:", existing.id);
    return;
  }

  const student = await prisma.student.create({
    data: {
      name: "João Silva",
      email: "joao@exemplo.com",
      area: "marketing",
      stage: "Aceleração",
    },
  });

  await prisma.metric.createMany({
    data: [
      { studentId: student.id, name: "Leads Gerados", value: 45, area: "marketing" },
      { studentId: student.id, name: "Taxa de Conversão (%)", value: 3.2, area: "marketing" },
      { studentId: student.id, name: "Ticket Médio (USD)", value: 2500, area: "marketing" },
      { studentId: student.id, name: "NPS", value: 72, area: "produto" },
      { studentId: student.id, name: "Entregas no Prazo (%)", value: 85, area: "produto" },
      { studentId: student.id, name: "Receita Mensal (USD)", value: 15000, area: "presidente" },
      { studentId: student.id, name: "Margem (%)", value: 35, area: "presidente" },
    ],
  });

  console.log("Seed concluído! ID do aluno:", student.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
