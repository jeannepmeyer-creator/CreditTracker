import type { SubscriptionStatus } from "@/lib/credits";

interface StatusBadgeProps {
  status: SubscriptionStatus;
}

const config: Record<SubscriptionStatus, { label: string; classes: string }> = {
  active: { label: "Active", classes: "bg-brand/15 text-brand-dark border border-brand/30" },
  grace: { label: "Grace Period", classes: "bg-amber-50 text-amber-700 border border-amber-300" },
  expired: { label: "Expired", classes: "bg-red-50 text-red-700 border border-red-300" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
