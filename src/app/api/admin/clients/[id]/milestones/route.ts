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
  const { label, amount, dueDate, notes } = body;

  if (!label || amount === undefined || !dueDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const milestone = await prisma.paymentMilestone.create({
    data: {
      clientId,
      label,
      amount: Number(amount),
      dueDate: new Date(dueDate),
      notes: notes ?? null,
    },
  });

  return NextResponse.json(milestone, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id: clientId } = await params;
  const body = await request.json();
  const { milestoneId, label, amount, dueDate, paidDate, notes } = body;

  if (!milestoneId) {
    return NextResponse.json({ error: "Missing milestoneId" }, { status: 400 });
  }

  const milestone = await prisma.paymentMilestone.update({
    where: { id: milestoneId, clientId },
    data: {
      ...(label !== undefined && { label }),
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      ...(paidDate !== undefined && {
        paidDate: paidDate ? new Date(paidDate) : null,
      }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(milestone);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id: clientId } = await params;
  const body = await request.json();
  const { milestoneId } = body;

  if (!milestoneId) {
    return NextResponse.json({ error: "Missing milestoneId" }, { status: 400 });
  }

  await prisma.paymentMilestone.deleteMany({
    where: { id: milestoneId, clientId },
  });

  return NextResponse.json({ ok: true });
}
