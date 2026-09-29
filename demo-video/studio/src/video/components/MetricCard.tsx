import type { LucideIcon } from 'lucide-react';

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  delta: string;
  accent: string;
  icon: LucideIcon;
  iconClassName: string;
};

export const MetricCard = ({
  label,
  value,
  hint,
  delta,
  accent,
  icon: Icon,
  iconClassName,
}: MetricCardProps) => (
  <div className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
    <div className="h-[3px]" style={{ background: accent }} />
    <div className="px-4 pb-3.5 pt-3">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`grid size-8 place-items-center rounded-[10px] ${iconClassName}`}
        >
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
        <span className="text-[11px] font-medium text-[#5f7273]">{label}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className="whitespace-nowrap text-[21px] font-semibold leading-none tracking-[-.03em]">
          {value}
        </span>
        <span className="truncate rounded-full bg-[#f2f5f4] px-2 py-1 text-[9.5px] font-medium text-[#5f7273]">
          {delta}
        </span>
      </div>
      <p className="mt-2 truncate text-[10px] text-[#93a5a5]">{hint}</p>
    </div>
  </div>
);
