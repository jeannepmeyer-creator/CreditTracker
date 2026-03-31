import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateClientToken } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const clients = await prisma.client.findMany({
    include: {
      transactions: true,
      milestones: { orderBy: { dueDate: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const { name, email, company, totalCredits, startDate, endDate, gracePeriodDays } = body;

  if (!name || !email || !company || !totalCredits || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      email,
      company,
      token: generateClientToken(),
      totalCredits: Number(totalCredits),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      gracePeriodDays: gracePeriodDays !== undefined ? Number(gracePeriodDays) : 90,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
