import { Badge } from '@/components/ui/badge';
import { CustomerType } from '@/features/customers/customers.types';

interface CustomerBadgeProps {
  type: CustomerType;
}

const badgeVariants: Record<CustomerType, string> = {
  normal: "bg-muted text-muted-foreground",
  loyal: "bg-primary/20 text-primary",
  deluxe: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  premium: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  VIP: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function CustomerBadge({ type }: CustomerBadgeProps) {
  return (
    <Badge variant="secondary" className={badgeVariants[type]}>
      {type}
    </Badge>
  );
}
