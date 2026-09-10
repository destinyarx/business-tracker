import { Badge } from '@/components/ui/badge';
import { CustomerType } from '@/features/customers/customers.types';

interface CustomerBadgeProps {
  type: CustomerType;
}

const badgeVariants: Record<CustomerType, string> = {
  normal: 'bg-[#edf1f0] text-[#5f7273] dark:bg-[#243936] dark:text-[#c3d4d1]',
  loyal: 'bg-[#e4f7f4] text-[#00706a] dark:bg-[#153b37] dark:text-[#5eebdd]',
  deluxe: 'bg-[#fff7e0] text-[#8a6100] dark:bg-[#493b16] dark:text-[#ffd56a]',
  premium: 'bg-[#fdecef] text-[#a73551] dark:bg-[#49212b] dark:text-[#ff9bb0]',
  VIP: 'bg-[#f3eeff] text-[#5b34c7] dark:bg-[#302653] dark:text-[#c5afff]',
};

export function CustomerBadge({ type }: CustomerBadgeProps) {
  return (
    <Badge variant="secondary" className={`${badgeVariants[type]} rounded-full border-0 px-2.5 py-1 text-[10.5px] font-semibold capitalize shadow-none`}>
      {type === 'VIP' ? 'VIP' : type}
    </Badge>
  );
}
