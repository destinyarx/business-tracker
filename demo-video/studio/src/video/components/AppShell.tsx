import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Bot,
  Boxes,
  ChevronLeft,
  CircleDollarSign,
  Moon,
  Package,
  ReceiptText,
  ShoppingBag,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { demoOwner } from '../mock-data';

type NavItem = {
  label: string;
  icon: LucideIcon;
};

const navigation: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: BarChart3 },
      { label: 'Sales', icon: CircleDollarSign },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Orders', icon: ShoppingBag },
      { label: 'Customers', icon: Users },
      { label: 'Products', icon: Package },
      { label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Money',
    items: [
      { label: 'Expenses', icon: ReceiptText },
      { label: 'NegosyoAI', icon: Bot },
    ],
  },
];

const descriptions: Record<string, string> = {
  Dashboard:
    'One screen for the whole shop — money in, money out, and what needs doing.',
  Orders: 'Manage every order from pending to completed.',
  Sales: 'Track revenue and understand what is selling.',
  Inventory: 'See stock levels and inventory movement.',
};

type AppShellProps = {
  active: 'Dashboard' | 'Orders' | 'Sales' | 'Inventory';
  children: ReactNode;
};

export const AppShell = ({ active, children }: AppShellProps) => (
  <div className="grid h-[852px] grid-cols-[236px_minmax(0,1fr)] bg-[#f2f5f4] text-[#16292b]">
    <aside className="flex flex-col bg-gradient-to-b from-[#00beaa] via-[#00a899] to-[#008e85] px-3 pb-5 pt-4 text-white">
      <div className="mb-5 flex items-center gap-2.5 px-1.5">
        <span className="grid size-8 place-items-center rounded-[10px] bg-white text-[15px] font-bold text-[#00706a] shadow-sm">
          N
        </span>
        <span className="text-[14px] font-semibold">NegosyoTracker</span>
        <span className="ml-auto grid size-7 place-items-center rounded-[9px] border border-white/30 bg-white/15">
          <ChevronLeft className="size-4" />
        </span>
      </div>
      {navigation.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-2 pb-1.5 font-mono text-[9px] font-medium uppercase tracking-[.18em] text-white/70">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className={`flex h-10 items-center gap-2.5 rounded-[11px] px-2.5 text-[13px] ${active === label ? 'bg-white/20 font-semibold shadow-[inset_2.5px_0_0_#fff]' : 'text-[#eafbf8]'}`}
              >
                <Icon className="size-5" strokeWidth={1.8} />
                {label}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-auto rounded-xl bg-white/10 px-3 py-2.5">
        <p className="text-[10px] text-white/70">Workspace</p>
        <p className="mt-0.5 truncate text-[12px] font-semibold">
          {demoOwner.businessName}
        </p>
      </div>
    </aside>
    <div className="min-w-0">
      <header className="flex h-16 items-center gap-3 border-b border-[#e3e9e8] bg-white/95 px-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-[18px] font-semibold leading-tight tracking-[-.025em]">
            {active}
          </h1>
          <p className="mt-0.5 truncate text-[11px] text-[#5f7273]">
            {descriptions[active]}
          </p>
        </div>
        <span className="grid size-9 place-items-center rounded-full border border-[#e3e9e8]">
          <Moon className="size-4" />
        </span>
        <div className="flex items-center gap-2 rounded-full border border-[#e3e9e8] bg-white py-1 pl-1 pr-3">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#a8d97c] to-[#12cdbe] text-[11px] font-bold text-[#0c4b47]">
            MS
          </span>
          <span className="leading-tight">
            <span className="block text-[11.5px] font-semibold">
              {demoOwner.name}
            </span>
            <span className="block text-[9.5px] text-[#93a5a5]">
              {demoOwner.role}
            </span>
          </span>
        </div>
      </header>
      <main className="h-[788px] overflow-hidden p-5">{children}</main>
    </div>
  </div>
);
