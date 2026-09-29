import type { ReactNode } from 'react';
import { Circle } from 'lucide-react';

type BrowserWindowProps = {
  children: ReactNode;
  url?: string;
  className?: string;
};

export const BrowserWindow = ({
  children,
  url = 'app.negosyotracker.ph/dashboard',
  className = '',
}: BrowserWindowProps) => (
  <div
    className={`overflow-hidden rounded-[28px] border border-white/25 bg-white shadow-[0_54px_120px_-35px_rgba(0,0,0,.62)] ${className}`}
  >
    <div className="flex h-12 items-center gap-2 border-b border-[#e3e9e8] bg-[#fbfcfc] px-4">
      <Circle className="size-3 fill-[#ff6b63] text-[#ff6b63]" />
      <Circle className="size-3 fill-[#ffb018] text-[#ffb018]" />
      <Circle className="size-3 fill-[#4fc26b] text-[#4fc26b]" />
      <div className="ml-3 flex h-7 min-w-0 flex-1 items-center rounded-full border border-[#e3e9e8] bg-white px-4 font-mono text-[11px] text-[#708283]">
        <span className="mr-2 text-[#00a899]">●</span>
        {url}
      </div>
      <div className="size-7 rounded-full bg-[#edf1f0]" />
    </div>
    {children}
  </div>
);
