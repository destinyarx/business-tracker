import { Badge } from '@/components/ui/badge';
import { CustomerType } from '@/features/customers/customers.types';

interface CustomerBadgeProps {
  type: CustomerType;
}

const badgeVariants: Record<CustomerType, string> = {
  normal: "bg-slate-700 text-zinc-50",
  loyal: "bg-primary/20 text-primary",
  deluxe: "bg-amber-500 text-white dark:bg-amber-900/30 dark:text-amber-400",
  premium: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  VIP: "bg-emerald-400 text-zinc-50 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function CustomerBadge({ type }: CustomerBadgeProps) {
  return (
    <Badge variant="secondary" className={badgeVariants[type]}>
      {type}
    </Badge>
  );
}
