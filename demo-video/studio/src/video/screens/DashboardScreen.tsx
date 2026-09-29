import {
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  dashboardAfter,
  dashboardBefore,
  expenseBreakdown,
  formatCurrency,
  topCustomers,
  topProducts,
} from '../mock-data';
import type { DashboardNumbers } from '../types';
import { AppShell } from '../components/AppShell';
import { MetricCard } from '../components/MetricCard';

type DashboardScreenProps = {
  mode: 'before' | 'after';
  animateImpact?: boolean;
};

const interpolateNumber = (
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const DashboardScreen = ({
  mode,
  animateImpact = false,
}: DashboardScreenProps) => {
  const frame = useCurrentFrame();
  const target: DashboardNumbers =
    mode === 'after' ? dashboardAfter : dashboardBefore;
  const numbers = animateImpact
    ? {
        sales: interpolateNumber(
          frame,
          70,
          145,
          dashboardBefore.sales,
          dashboardAfter.sales,
        ),
        expenses: dashboardAfter.expenses,
        profit: interpolateNumber(
          frame,
          90,
          165,
          dashboardBefore.profit,
          dashboardAfter.profit,
        ),
        completedOrders: Math.round(
          interpolateNumber(
            frame,
            105,
            165,
            dashboardBefore.completedOrders,
            dashboardAfter.completedOrders,
          ),
        ),
        queuedOrders: Math.round(
          interpolateNumber(
            frame,
            105,
            165,
            dashboardBefore.queuedOrders,
            dashboardAfter.queuedOrders,
          ),
        ),
        totalOrders: target.totalOrders,
      }
    : target;

  const chartGrowth = animateImpact
    ? interpolate(frame, [115, 190], [0.78, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <AppShell active="Dashboard">
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[10.5px] text-[#93a5a5]">
          Every figure below comes from completed orders and expense records in
          this month.
        </p>
        <span className="ml-auto rounded-full border border-[#dce3e2] bg-white px-3 py-2 text-[10.5px] font-semibold text-[#0c4b47]">
          ▣ &nbsp; This month
        </span>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-3">
        <MetricCard
          label="Sales on record"
          value={formatCurrency(numbers.sales)}
          delta={`${numbers.completedOrders} completed`}
          hint="This month · completed orders only"
          icon={ShoppingCart}
          accent="linear-gradient(90deg,#12cdbe,#a8d97c)"
          iconClassName="bg-[#e4f7f4] text-[#00706a]"
        />
        <MetricCard
          label="Expenses on record"
          value={formatCurrency(numbers.expenses)}
          delta="7 records"
          hint="This month · recorded business costs"
          icon={ReceiptText}
          accent="linear-gradient(90deg,#ffb018,#ffd98a)"
          iconClassName="bg-[#fff7e0] text-[#8a6100]"
        />
        <MetricCard
          label="Estimated profit"
          value={formatCurrency(numbers.profit)}
          delta="Estimate only"
          hint="Uses profit captured when sales are recognized"
          icon={TrendingUp}
          accent="linear-gradient(90deg,#b01c1c,#ff8a8a)"
          iconClassName="bg-[#fdecec] text-[#b01c1c]"
        />
        <MetricCard
          label="Completed orders"
          value={String(numbers.completedOrders)}
          delta={`${numbers.queuedOrders} still in queue`}
          hint={`This month · out of ${numbers.totalOrders} orders on file`}
          icon={PackageCheck}
          accent="linear-gradient(90deg,#1d4ed8,#7fa6ff)"
          iconClassName="bg-[#e6f0fe] text-[#1d4ed8]"
        />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <section className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
          <header className="flex items-center border-b border-[#edf1f0] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-semibold">
                Money in vs money out
              </h2>
              <p className="text-[9.5px] text-[#93a5a5]">
                From completed orders and expense records.
              </p>
            </div>
            <div className="ml-auto flex gap-3 text-[9.5px] text-[#5f7273]">
              <span>
                <i className="mr-1 inline-block size-2 rounded-sm bg-[#12cdbe]" />
                Sales
              </span>
              <span>
                <i className="mr-1 inline-block size-2 rounded-sm bg-[#ffb018]" />
                Expenses
              </span>
            </div>
          </header>
          <div className="flex h-[174px] items-end gap-6 px-6 pb-7 pt-5">
            {[0.48, 0.67, 0.6, 0.82, 0.72, 0.91].map((height, index) => (
              <div
                key={height}
                className="flex flex-1 items-end justify-center gap-1.5"
              >
                <span
                  className="w-4 rounded-t-[5px] bg-[#12cdbe]"
                  style={{ height: 112 * height * chartGrowth }}
                />
                <span
                  className="w-4 rounded-t-[5px] bg-[#ffb018]"
                  style={{
                    height: 91 * [0.7, 0.86, 0.62, 0.92, 0.76, 0.68][index],
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
          <header className="flex items-center border-b border-[#edf1f0] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-semibold">
                Where the money went
              </h2>
              <p className="text-[9.5px] text-[#93a5a5]">
                Recorded expenses by category.
              </p>
            </div>
            <span className="ml-auto font-mono text-[11px] font-semibold">
              {formatCurrency(numbers.expenses)}
            </span>
          </header>
          <div className="space-y-2.5 px-4 py-3">
            {expenseBreakdown.map((category) => (
              <div key={category.label}>
                <div className="mb-1 flex items-center text-[10px]">
                  <span
                    className="mr-2 size-2 rounded-sm"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.label}</span>
                  <span className="ml-auto font-mono">
                    {formatCurrency(category.amount)}
                  </span>
                  <span className="ml-2 w-7 text-right text-[#93a5a5]">
                    {category.percentage}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#f2f5f4]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <section className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
          <header className="border-b border-[#edf1f0] px-4 py-3">
            <h2 className="text-[13px] font-semibold">Needs your attention</h2>
            <p className="text-[9.5px] text-[#93a5a5]">
              4 things to look at today
            </p>
          </header>
          {[
            [
              '#b01c1c',
              'Abaca Market Tote is out of stock',
              '0 units available',
            ],
            [
              '#ffb018',
              'Banana Chips 250g is running low',
              '4 units remaining',
            ],
            [
              '#1d4ed8',
              `${numbers.queuedOrders} orders are still in the queue`,
              'Pending and in-progress orders',
            ],
          ].map(([color, title, detail]) => (
            <div
              key={title}
              className="flex items-start gap-2.5 border-b border-[#f0f3f2] px-4 py-2.5 last:border-0"
            >
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>
                <span className="block text-[10.5px] font-medium">{title}</span>
                <span className="mt-0.5 block text-[9px] text-[#93a5a5]">
                  {detail}
                </span>
              </span>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
          <header className="border-b border-[#edf1f0] px-4 py-3">
            <h2 className="text-[13px] font-semibold">Top products</h2>
            <p className="text-[9.5px] text-[#93a5a5]">
              By sales value in completed orders.
            </p>
          </header>
          <div className="space-y-3 px-4 py-3">
            {topProducts.map((product) => (
              <div key={product.rank}>
                <div className="mb-1 flex items-center gap-2 text-[10px]">
                  <span className="font-mono text-[#93a5a5]">
                    0{product.rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {product.title}
                  </span>
                  <span className="font-mono">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f2f5f4]">
                    <span
                      className="block h-full rounded-full bg-[#12cdbe]"
                      style={{ width: `${product.percent}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-[#93a5a5]">
                    {product.sold} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
          <header className="border-b border-[#edf1f0] px-4 py-3">
            <h2 className="text-[13px] font-semibold">Who is buying</h2>
            <p className="text-[9.5px] text-[#93a5a5]">
              Completed order value per customer.
            </p>
          </header>
          {topCustomers.slice(0, 3).map((customer) => (
            <div
              key={customer.rank}
              className="flex items-center gap-2.5 border-b border-[#f0f3f2] px-4 py-2.5 last:border-0"
            >
              <span className="grid size-7 place-items-center rounded-[9px] bg-[#f2f5f4] text-[9.5px] font-bold">
                {customer.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10.5px] font-medium">
                  {customer.name}
                </span>
                <span className="text-[9px] text-[#93a5a5]">
                  {customer.orders} completed orders
                </span>
              </span>
              <span className="text-right">
                <span className="block font-mono text-[10px] font-medium">
                  {formatCurrency(customer.sales)}
                </span>
                <span className="text-[8.5px] text-[#93a5a5]">
                  {customer.percent}% of sales
                </span>
              </span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
};
