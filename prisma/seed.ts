import "dotenv/config";
import * as dotenvLocal from "dotenv";
dotenvLocal.config({ path: ".env.local", override: true });

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  // Clear existing data
  await prisma.paymentMilestone.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.client.deleteMany();

  // --- Kiss The Ground ---
  const ktg = await prisma.client.create({
    data: {
      name: "Karen Rodriguez",
      company: "Kiss The Ground",
      email: "karen@kisstheground.com",
      token: uuidv4(),
      totalCredits: 36,
      startDate: new Date("2026-04-01T00:00:00.000Z"),
      endDate: new Date("2026-11-30T00:00:00.000Z"),
      gracePeriodDays: 90,
    },
  });

  await prisma.paymentMilestone.createMany({
    data: [
      {
        clientId: ktg.id,
        label: "Installment 1",
        amount: 2200,
        dueDate: new Date("2026-04-01T00:00:00.000Z"),
      },
      {
        clientId: ktg.id,
        label: "Installment 2",
        amount: 2200,
        dueDate: new Date("2026-06-01T00:00:00.000Z"),
      },
      {
        clientId: ktg.id,
        label: "Installment 3",
        amount: 2200,
        dueDate: new Date("2026-08-01T00:00:00.000Z"),
      },
      {
        clientId: ktg.id,
        label: "Installment 4",
        amount: 2200,
        dueDate: new Date("2026-10-01T00:00:00.000Z"),
      },
    ],
  });

  // --- REVERVE Agency ---
  const reverve = await prisma.client.create({
    data: {
      name: "REVERVE Agency",
      company: "REVERVE Agency",
      email: "hello@reverveagency.com",
      token: uuidv4(),
      totalCredits: 24,
      startDate: new Date("2026-04-01T00:00:00.000Z"),
      endDate: new Date("2026-10-30T00:00:00.000Z"),
      gracePeriodDays: 90,
    },
  });

  await prisma.paymentMilestone.createMany({
    data: [
      {
        clientId: reverve.id,
        label: "Installment 1",
        amount: 1475,
        dueDate: new Date("2026-04-01T00:00:00.000Z"),
      },
      {
        clientId: reverve.id,
        label: "Installment 2",
        amount: 1475,
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
      },
      {
        clientId: reverve.id,
        label: "Installment 3",
        amount: 1475,
        dueDate: new Date("2026-07-01T00:00:00.000Z"),
      },
      {
        clientId: reverve.id,
        label: "Installment 4",
        amount: 1475,
        dueDate: new Date("2026-09-01T00:00:00.000Z"),
      },
    ],
  });

  console.log("✓ Seeded Kiss The Ground — token:", ktg.token);
  console.log("✓ Seeded REVERVE Agency   — token:", reverve.token);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
