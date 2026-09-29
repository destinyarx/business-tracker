import { Check, ChevronDown, PackageCheck } from 'lucide-react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AppShell } from '../components/AppShell';
import { formatCurrency, heroOrder, products } from '../mock-data';

export const FulfillmentScreen = () => {
  const frame = useCurrentFrame();
  const isInProgress = frame >= 115;
  const isCompleted = frame >= 285;
  const status = isCompleted
    ? 'Completed'
    : isInProgress
      ? 'In Progress'
      : 'Pending';
  const badgeClass = isCompleted
    ? 'bg-[#e4f7f4] text-[#00706a]'
    : isInProgress
      ? 'bg-[#e6f0fe] text-[#1d4ed8]'
      : 'bg-[#fff7e0] text-[#8a6100]';
  const stockProgress = interpolate(frame, [118, 178], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ubeStock = Math.round(18 - stockProgress * 2);
  const mangoStock = Math.round(9 - stockProgress * 2);
  const calamansiStock = Math.round(16 - stockProgress);

  return (
    <AppShell active="Orders">
      <div className="mb-4 flex items-center">
        <div className="flex h-9 w-[260px] items-center rounded-full border border-[#e3e9e8] bg-[#f6f8f8] px-4 text-[10.5px] text-[#93a5a5]">
          Search orders...
        </div>
        <span className="ml-2 rounded-full border border-[#e3e9e8] bg-white px-3 py-2 text-[10px]">
          All statuses ⌄
        </span>
        <span className="ml-auto rounded-[10px] bg-[#0c4b47] px-4 py-2.5 text-[10.5px] font-semibold text-white">
          + New order
        </span>
      </div>

      <div className="grid grid-cols-[1.05fr_.95fr] gap-4">
        <section>
          <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[.14em] text-[#93a5a5]">
            Order lifecycle
          </p>
          <article className="rounded-[18px] border border-[#c2e7e2] bg-white px-5 py-4 shadow-[0_18px_34px_-28px_rgba(12,75,71,.5)]">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-[11px] bg-[#f2f5f4] text-[11px] font-bold">
                JD
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[9.5px] text-[#7c8e8e]">
                  #{heroOrder.id} · {heroOrder.createdAt}
                </div>
                <h2 className="mt-1 text-[15px] font-semibold">
                  {heroOrder.orderName}
                </h2>
                <p className="text-[10.5px] text-[#5f7273]">
                  {heroOrder.customerName}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${badgeClass}`}
              >
                {status}
              </span>
            </div>
            <p className="mt-3 border-t border-dashed border-[#e3e9e8] pt-2.5 text-[10px] text-[#7c8e8e]">
              Notes: {heroOrder.notes}
            </p>
            <div className="mt-3 space-y-2 border-t border-dashed border-[#e3e9e8] pt-3">
              {[
                [2, 'Ube Pandesal Box', 560],
                [2, 'Cebu Dried Mango 200g', 490],
                [1, 'Calamansi Concentrate', 260],
              ].map(([quantity, title, amount]) => (
                <div key={String(title)} className="flex text-[10.5px]">
                  <span className="w-8 font-mono text-[#007f78]">
                    {quantity}×
                  </span>
                  <span>{title}</span>
                  <span className="ml-auto font-mono">
                    {formatCurrency(Number(amount))}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-end border-t border-[#edf1f0] pt-3">
              <div>
                <p className="text-[9px] text-[#7c8e8e]">5 items</p>
                <p className="text-[18px] font-semibold">
                  {formatCurrency(heroOrder.totalAmount)}
                </p>
              </div>
              <span className="ml-auto flex items-center gap-2 rounded-[10px] bg-[#e4f7f4] px-3 py-2 text-[10px] font-semibold text-[#00706a]">
                Update Status <ChevronDown className="size-3" />
              </span>
            </div>
          </article>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {['Pending', 'In Progress', 'Completed'].map((step, index) => {
              const reached =
                index === 0 ||
                (index === 1 && isInProgress) ||
                (index === 2 && isCompleted);
              return (
                <div
                  key={step}
                  className={`rounded-[12px] border px-3 py-2.5 ${reached ? 'border-[#bfe7df] bg-[#f0faf7]' : 'border-[#e3e9e8] bg-white'}`}
                >
                  <div className="flex items-center">
                    <span
                      className={`grid size-5 place-items-center rounded-full text-[8px] font-bold ${reached ? 'bg-[#0c4b47] text-white' : 'bg-[#edf1f0] text-[#93a5a5]'}`}
                    >
                      {reached ? <Check className="size-3" /> : index + 1}
                    </span>
                    <span className="ml-2 text-[9.5px] font-semibold">
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[.14em] text-[#93a5a5]">
            Inventory follows the work
          </p>
          <div className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
            <header className="flex items-center border-b border-[#edf1f0] px-4 py-3">
              <div>
                <h3 className="text-[13px] font-semibold">Stock on hand</h3>
                <p className="text-[9px] text-[#93a5a5]">
                  Updated when Order #5026 started.
                </p>
              </div>
              <span className="ml-auto rounded-[9px] border border-[#dce3e2] px-3 py-2 text-[9px]">
                Refresh
              </span>
            </header>
            <div className="bg-[#f8fafa] px-4 py-2.5 text-[8.5px] font-semibold uppercase tracking-[.1em] text-[#93a5a5]">
              Product <span className="float-right mr-3">Stock</span>
            </div>
            {[
              { product: products[1], stock: ubeStock },
              { product: products[2], stock: mangoStock },
              { product: products[6], stock: calamansiStock },
              { product: products[5], stock: 4 },
            ].map(({ product, stock }) => (
              <div
                key={product.id}
                className="flex items-center border-t border-[#f1f4f3] px-4 py-3"
              >
                <span
                  className="grid size-8 place-items-center rounded-[9px] text-[9px] font-bold text-white"
                  style={{
                    background: `linear-gradient(145deg,${product.palette[0]},${product.palette[1]})`,
                  }}
                >
                  {product.shortLabel}
                </span>
                <span className="ml-3 min-w-0 flex-1">
                  <span className="block truncate text-[10.5px] font-medium">
                    {product.title}
                  </span>
                  <span className="font-mono text-[8.5px] text-[#93a5a5]">
                    {product.sku}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-[13px] font-semibold">
                    {stock}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[8px] font-semibold ${stock < 10 ? 'bg-[#fff7e0] text-[#8a6100]' : 'bg-[#e4f7f4] text-[#00706a]'}`}
                  >
                    {stock < 10 ? 'Low stock' : 'In stock'}
                  </span>
                </span>
              </div>
            ))}
          </div>
          {isCompleted && (
            <div className="mt-3 flex items-center gap-3 rounded-[14px] border border-[#bfe7df] bg-[#f0faf7] px-4 py-3 text-[#0c4b47]">
              <span className="grid size-9 place-items-center rounded-full bg-[#0c4b47] text-white">
                <PackageCheck className="size-4" />
              </span>
              <span>
                <strong className="block text-[11px]">
                  Sale #7026 recognized
                </strong>
                <span className="text-[9px] text-[#5f7273]">
                  Completed Order #5026 ·{' '}
                  {formatCurrency(heroOrder.totalAmount)}
                </span>
              </span>
            </div>
          )}
        </section>
      </div>

      {frame >= 62 && frame < 116 && (
        <div className="absolute left-[392px] top-[585px] z-50 w-[170px] rounded-[12px] border border-[#dce3e2] bg-white p-1.5 shadow-[0_15px_34px_-18px_rgba(22,41,43,.5)]">
          <div className="rounded-[8px] px-3 py-2 text-[10px]">In Progress</div>
          <div className="rounded-[8px] px-3 py-2 text-[10px]">Cancelled</div>
          <div className="rounded-[8px] px-3 py-2 text-[10px]">Failed</div>
        </div>
      )}
      {frame >= 235 && frame < 286 && (
        <div className="absolute left-[392px] top-[585px] z-50 w-[170px] rounded-[12px] border border-[#dce3e2] bg-white p-1.5 shadow-[0_15px_34px_-18px_rgba(22,41,43,.5)]">
          <div className="rounded-[8px] bg-[#f3fbf8] px-3 py-2 text-[10px] font-semibold text-[#00706a]">
            Completed
          </div>
          <div className="rounded-[8px] px-3 py-2 text-[10px]">Cancelled</div>
          <div className="rounded-[8px] px-3 py-2 text-[10px]">Failed</div>
        </div>
      )}
    </AppShell>
  );
};
