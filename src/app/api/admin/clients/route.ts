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
  const { name, email, company, totalCredits, startDate, endDate, gracePeriodDays, token } = body;

  if (!name || !email || !company || !totalCredits || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = token
    ? token.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : generateClientToken();

  if (token) {
    const existing = await prisma.client.findUnique({ where: { token: slug } });
    if (existing) {
      return NextResponse.json({ error: "That URL slug is already in use" }, { status: 409 });
    }
  }

  const client = await prisma.client.create({
    data: {
      name,
      email,
      company,
      token: slug,
      totalCredits: Number(totalCredits),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      gracePeriodDays: gracePeriodDays !== undefined ? Number(gracePeriodDays) : 90,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
