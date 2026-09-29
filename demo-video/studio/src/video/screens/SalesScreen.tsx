import {
  Boxes,
  ChartNoAxesColumnIncreasing,
  Check,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AppShell } from '../components/AppShell';
import { existingSales, formatCurrency, heroSale } from '../mock-data';

export const SalesScreen = () => {
  const frame = useCurrentFrame();
  const rowVisible = frame >= 55;
  const detailOpen = frame >= 205;
  const totalSales = interpolate(frame, [55, 135], [40620, 41930], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AppShell active="Sales">
      <div className="mb-3 grid grid-cols-4 gap-3">
        {[
          {
            label: 'Sales today',
            value: formatCurrency(totalSales),
            hint: '12 recognized sales',
            icon: ChartNoAxesColumnIncreasing,
            color: '#12cdbe',
            tile: 'bg-[#e4f7f4] text-[#007f78]',
          },
          {
            label: 'Average sale',
            value: formatCurrency(totalSales / 12),
            hint: 'Per recognized sale',
            icon: ShoppingCart,
            color: '#ffb018',
            tile: 'bg-[#fff7e0] text-[#8a6100]',
          },
          {
            label: 'Units sold',
            value: rowVisible ? '91' : '86',
            hint: 'Across all sales shown',
            icon: Boxes,
            color: '#5b34c7',
            tile: 'bg-[#f3eeff] text-[#5b34c7]',
          },
          {
            label: 'Best customer',
            value: 'Angela Garcia',
            hint: 'Highest sales value shown',
            icon: Users,
            color: '#3b82f6',
            tile: 'bg-[#e6f0fe] text-[#1d4ed8]',
          },
        ].map(({ label, value, hint, icon: Icon, color, tile }) => (
          <div
            key={label}
            className="rounded-[16px] border border-[#e3e9e8] bg-white p-3.5"
          >
            <div className="flex items-center">
              <span
                className={`grid size-8 place-items-center rounded-[9px] ${tile}`}
              >
                <Icon className="size-4" />
              </span>
              <span className="ml-2 text-[10px] text-[#5f7273]">{label}</span>
            </div>
            <p
              className="mt-3 truncate text-[18px] font-semibold tracking-[-.025em]"
              style={{ color }}
            >
              {value}
            </p>
            <p className="text-[9px] text-[#93a5a5]">{hint}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
        <header className="flex items-center gap-2 border-b border-[#edf1f0] px-4 py-3">
          <h2 className="mr-auto text-[13px] font-semibold">Sales records</h2>
          <span className="rounded-[9px] border border-[#dce3e2] bg-[#f8fafa] px-3 py-2 text-[9.5px] text-[#93a5a5]">
            ⌕ Search sales
          </span>
          <span className="rounded-[9px] border border-[#dce3e2] px-3 py-2 text-[9.5px]">
            Today ⌄
          </span>
          <span className="rounded-[9px] border border-[#dce3e2] px-3 py-2 text-[9.5px]">
            Sale date (latest) ⌄
          </span>
        </header>
        <div className="grid grid-cols-[1.15fr_1fr_.9fr_1.45fr_.7fr_.7fr] bg-[#f8fafa] px-4 py-2.5 text-[8.5px] font-semibold uppercase tracking-[.1em] text-[#93a5a5]">
          <span>Sale</span>
          <span>Sale date</span>
          <span>Customer</span>
          <span>Product items</span>
          <span className="text-right">Profit</span>
          <span className="text-right">Sale total</span>
        </div>
        <div
          style={{
            height: rowVisible ? 66 : 0,
            opacity: rowVisible ? 1 : 0,
            overflow: 'hidden',
            backgroundColor: '#f3fbf8',
          }}
          className="border-b border-[#c2e7e2]"
        >
          <SaleRow sale={heroSale} highlight />
        </div>
        {existingSales.map((sale) => (
          <SaleRow key={sale.id} sale={sale} />
        ))}
        <footer className="flex items-center border-t border-[#edf1f0] px-4 py-3 text-[9.5px] text-[#7c8e8e]">
          <span>
            {rowVisible
              ? 'Showing 1–4 of 12 records'
              : 'Showing 1–3 of 11 records'}
          </span>
          <span className="ml-auto rounded-[8px] border border-[#dce3e2] px-3 py-1.5">
            Previous
          </span>
          <span className="mx-1 grid size-7 place-items-center rounded-[8px] bg-[#16292b] text-white">
            1
          </span>
          <span className="rounded-[8px] border border-[#dce3e2] px-3 py-1.5">
            Next
          </span>
        </footer>
      </section>

      {detailOpen && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-[#071513]/25">
          <div className="w-[500px] overflow-hidden rounded-[20px] bg-white shadow-[0_40px_80px_-30px_rgba(12,75,71,.6)]">
            <div className="h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
            <header className="border-b border-[#edf1f0] px-5 py-4">
              <div className="flex items-center">
                <span className="font-mono text-[9.5px] text-[#93a5a5]">
                  Sale #7026 · Order #5026
                </span>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#e7f7ec] px-2 py-1 text-[9px] font-semibold text-[#166534]">
                  <Check className="size-3" />
                  Recognized
                </span>
              </div>
              <h3 className="mt-1 text-[15px] font-semibold">
                {heroSale.orderName}
              </h3>
              <p className="text-[10px] text-[#5f7273]">
                {heroSale.customerName} · {heroSale.recognizedAt}
              </p>
            </header>
            <div className="px-5 py-4">
              <p className="mb-2 text-[8.5px] font-semibold uppercase tracking-[.1em] text-[#93a5a5]">
                Product items
              </p>
              {[
                ['2×', 'Ube Pandesal Box', '₱280.00 ea', '₱560.00'],
                ['2×', 'Cebu Dried Mango 200g', '₱245.00 ea', '₱490.00'],
                ['1×', 'Calamansi Concentrate', '₱260.00 ea', '₱260.00'],
              ].map((item) => (
                <div
                  key={item[1]}
                  className="mb-2 flex items-center rounded-[10px] border border-[#edf1f0] bg-[#fbfcfc] px-3 py-2.5 text-[10px]"
                >
                  <span className="w-8 font-mono font-semibold text-[#007f78]">
                    {item[0]}
                  </span>
                  <span className="flex-1">{item[1]}</span>
                  <span className="mr-3 font-mono text-[9px] text-[#93a5a5]">
                    {item[2]}
                  </span>
                  <span className="font-mono font-medium">{item[3]}</span>
                </div>
              ))}
            </div>
            <footer className="flex items-center border-t border-[#edf1f0] px-5 py-3.5">
              <div>
                <p className="text-[9px] text-[#93a5a5]">
                  5 units · Profit {formatCurrency(heroSale.totalProfit)}
                </p>
                <p className="text-[19px] font-semibold">
                  {formatCurrency(heroSale.totalAmount)}
                </p>
              </div>
              <span className="ml-auto rounded-[10px] bg-[#0c4b47] px-4 py-2.5 text-[10px] font-semibold text-white">
                Close details
              </span>
            </footer>
          </div>
        </div>
      )}
    </AppShell>
  );
};

type SaleRowProps = {
  sale: typeof heroSale;
  highlight?: boolean;
};

const SaleRow = ({ sale, highlight = false }: SaleRowProps) => (
  <div
    className={`grid h-[66px] grid-cols-[1.15fr_1fr_.9fr_1.45fr_.7fr_.7fr] items-center border-b border-[#f1f4f3] px-4 text-[10px] ${highlight ? 'shadow-[inset_3px_0_0_#12cdbe]' : ''}`}
  >
    <span>
      <strong className="block truncate font-medium">{sale.orderName}</strong>
      <small className="font-mono text-[8.5px] text-[#93a5a5]">
        Sale #{sale.id} · Order #{sale.orderId}
      </small>
    </span>
    <span className="text-[9.5px] text-[#5f7273]">{sale.recognizedAt}</span>
    <span>{sale.customerName}</span>
    <span className="truncate text-[#5f7273]">{sale.itemSummary}</span>
    <span className="text-right font-mono font-medium text-[#166534]">
      {formatCurrency(sale.totalProfit)}
    </span>
    <span className="text-right font-mono font-medium">
      {formatCurrency(sale.totalAmount)}
    </span>
  </div>
);
