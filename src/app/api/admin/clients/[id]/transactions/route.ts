import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id: clientId } = await params;
  const body = await request.json();
  const { description, creditsUsed, date } = body;

  if (!description || creditsUsed === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const transaction = await prisma.creditTransaction.create({
    data: {
      clientId,
      description,
      creditsUsed: Number(creditsUsed),
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id: clientId } = await params;
  const body = await request.json();
  const { transactionId } = body;

  if (!transactionId) {
    return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
  }

  await prisma.creditTransaction.deleteMany({
    where: { id: transactionId, clientId },
  });

  return NextResponse.json({ ok: true });
}
