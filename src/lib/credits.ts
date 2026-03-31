export function getGracePeriodEnd(endDate: Date, gracePeriodDays: number): Date {
  const d = new Date(endDate);
  d.setDate(d.getDate() + gracePeriodDays);
  return d;
}

export type SubscriptionStatus = "active" | "grace" | "expired";

export function getStatus(endDate: Date, gracePeriodDays: number): SubscriptionStatus {
  const now = new Date();
  if (now <= endDate) return "active";
  const gracePeriodEnd = getGracePeriodEnd(endDate, gracePeriodDays);
  if (now <= gracePeriodEnd) return "grace";
  return "expired";
}

export function getCreditStatus(used: number, total: number): "healthy" | "low" | "critical" {
  const pct = total > 0 ? used / total : 1;
  if (pct < 0.7) return "healthy";
  if (pct < 0.9) return "low";
  return "critical";
}
