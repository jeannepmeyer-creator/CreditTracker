import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateClientToken } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const clients = await prisma.client.findMany({
    include: { transactions: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const { name, email, company, tier, totalCredits, startDate, endDate } = body;

  if (!name || !email || !tier || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      email,
      company: company ?? null,
      token: generateClientToken(),
      tier: Number(tier),
      totalCredits: Number(totalCredits),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json(client, { status: 201 });
}
