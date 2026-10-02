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
  const { name, email, company, totalCredits, startDate, endDate, gracePeriodDays, token } = body;

  if (token !== undefined) {
    const slug = token.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const existing = await prisma.client.findUnique({ where: { token: slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "That URL slug is already in use" }, { status: 409 });
    }
  }

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
      ...(token !== undefined && { token: token.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") }),
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
