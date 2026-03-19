export const TIERS = {
  12: {
    credits: 12,
    price: 3000,
    duration: "mid-May – mid-Sept",
    payment: "50% at start; balance at conclusion",
  },
  24: {
    credits: 24,
    price: 5900,
    duration: "mid-May – mid-Sept",
    payment: "4 × $1,475 installments",
  },
  36: {
    credits: 36,
    price: 8800,
    duration: "mid-May – mid-Nov",
    payment: "4 × $2,200 installments",
  },
} as const;

export type TierKey = keyof typeof TIERS;

export const TIER_OPTIONS = [12, 24, 36] as TierKey[];

export function getTier(tier: number) {
  return TIERS[tier as TierKey] ?? null;
}
