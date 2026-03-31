import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      transactions: { orderBy: { date: "desc" } },
      milestones: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const { name, email, company, totalCredits, startDate, endDate, gracePeriodDays } = body;

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(company !== undefined && { company }),
      ...(totalCredits !== undefined && { totalCredits: Number(totalCredits) }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: new Date(endDate) }),
      ...(gracePeriodDays !== undefined && { gracePeriodDays: Number(gracePeriodDays) }),
    },
    include: {
      transactions: { orderBy: { date: "desc" } },
      milestones: { orderBy: { dueDate: "asc" } },
    },
  });

  return NextResponse.json(client);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
