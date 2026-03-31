"use client";

interface CreditBarProps {
  used: number;
  total: number;
}

export function CreditBar({ used, total }: CreditBarProps) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 100;
  const color =
    pct < 70 ? "bg-brand" : pct < 90 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{used} used</span>
        <span className="text-gray-600">{total - used} remaining</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">
        {used} / {total} credits
      </div>
    </div>
  );
}
