import { Check, Minus, Plus, Search, ShoppingBag } from 'lucide-react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AppShell } from '../components/AppShell';
import {
  customers,
  formatCurrency,
  heroOrder,
  heroOrderItems,
  products,
} from '../mock-data';

const productFor = (productId: number) =>
  products.find((product) => product.id === productId) ?? products[0];

type ProductTileProps = {
  productId: number;
  selected: boolean;
  quantity: number;
};

const ProductTile = ({ productId, selected, quantity }: ProductTileProps) => {
  const product = productFor(productId);

  return (
    <article
      className={`rounded-[15px] border p-2.5 ${selected ? 'border-[#12cdbe] bg-[#f3fbf8]' : 'border-[#e3e9e8] bg-[#fbfcfc]'}`}
    >
      <div
        className="relative grid h-[94px] place-items-center overflow-hidden rounded-[10px] text-2xl font-bold text-white"
        style={{
          background: `linear-gradient(145deg,${product.palette[0]},${product.palette[1]})`,
        }}
      >
        <span className="opacity-90">{product.shortLabel}</span>
        {selected && (
          <span className="absolute right-2 top-2 rounded-full bg-[#0c4b47] px-2 py-1 text-[8.5px] font-semibold text-white">
            In order · {quantity}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-[10.5px] font-semibold">
        {product.title}
      </p>
      <p className="mt-0.5 text-[8.5px] text-[#93a5a5]">{product.category}</p>
      <div className="mt-2 flex items-center">
        <span className="text-[10.5px] font-semibold text-[#007f78]">
          {formatCurrency(product.price)}
        </span>
        <span className="ml-auto text-[8.5px] text-[#7c8e8e]">
          {product.stock} left
        </span>
      </div>
      <div
        className={`mt-2 flex h-7 items-center justify-center gap-1.5 rounded-[9px] border text-[9.5px] font-semibold ${selected ? 'border-[#12cdbe] bg-[#e4f7f4] text-[#00706a]' : 'border-[#dce3e2] bg-white'}`}
      >
        {selected ? <Check className="size-3" /> : <Plus className="size-3" />}
        {selected ? 'Added' : 'Add to order'}
      </div>
    </article>
  );
};

export const OrderCreateScreen = () => {
  const frame = useCurrentFrame();
  const typedOrderName = heroOrder.orderName.slice(
    0,
    Math.floor(
      interpolate(frame, [70, 125], [0, heroOrder.orderName.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );
  const typedNote = heroOrder.notes.slice(
    0,
    Math.floor(
      interpolate(frame, [125, 178], [0, heroOrder.notes.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );
  const firstAdded = frame >= 255;
  const secondAdded = frame >= 330;
  const thirdAdded = frame >= 410;
  const quantitiesAdjusted = frame >= 465;
  const orderItems = [
    ...(firstAdded ? [heroOrderItems[0]] : []),
    ...(secondAdded ? [heroOrderItems[1]] : []),
    ...(thirdAdded ? [heroOrderItems[2]] : []),
  ];
  const subtotal = orderItems.reduce((sum, item) => {
    if (!quantitiesAdjusted && item.productId !== 107)
      return sum + item.priceAtPurchase;
    return sum + item.subtotal;
  }, 0);

  return (
    <AppShell active="Orders">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold text-[#007f78]">
        ← Back to orders
      </div>
      <div className="mb-3">
        <h2 className="text-[19px] font-semibold tracking-[-.025em]">
          Create order
        </h2>
        <p className="text-[10.5px] text-[#5f7273]">
          Give it a name or attach a customer, then add products from stock.
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1.5fr)_330px] items-start gap-3.5">
        <div className="space-y-3.5">
          <section className="rounded-[18px] border border-[#e3e9e8] bg-white px-4 py-3.5">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-[#16292b] text-[9px] font-bold text-white">
                1
              </span>
              <h3 className="text-[13px] font-semibold">Order details</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[10px] font-medium">
                Order name
                <div className="mt-1 flex h-9 items-center rounded-[10px] border border-[#dce3e2] px-3 text-[11px]">
                  {typedOrderName}
                  <span className="ml-0.5 h-4 w-px bg-[#00a899]" />
                </div>
              </label>
              <label className="text-[10px] font-medium">
                Customer
                <div className="mt-1 flex h-9 items-center rounded-[10px] border border-[#dce3e2] px-3 text-[11px]">
                  {frame < 35
                    ? 'Guest customer (no record)'
                    : customers[2].name}
                  <span className="ml-auto text-[#93a5a5]">⌄</span>
                </div>
              </label>
            </div>
            <label className="mt-3 block text-[10px] font-medium">
              Notes
              <div className="mt-1 h-12 rounded-[10px] border border-[#dce3e2] px-3 py-2 text-[10.5px] text-[#5f7273]">
                {typedNote}
              </div>
            </label>
          </section>

          <section className="rounded-[18px] border border-[#e3e9e8] bg-white px-4 pb-4 pt-3.5">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-[#16292b] text-[9px] font-bold text-white">
                2
              </span>
              <h3 className="text-[13px] font-semibold">Add products</h3>
              <div className="ml-auto flex h-8 w-[190px] items-center rounded-[9px] border border-[#e3e9e8] bg-[#f8fafa] px-2.5 text-[9.5px] text-[#93a5a5]">
                <Search className="mr-2 size-3" />
                Search products
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              <ProductTile
                productId={102}
                selected={firstAdded}
                quantity={quantitiesAdjusted ? 2 : 1}
              />
              <ProductTile
                productId={103}
                selected={secondAdded}
                quantity={quantitiesAdjusted ? 2 : 1}
              />
              <ProductTile productId={107} selected={thirdAdded} quantity={1} />
              <ProductTile productId={101} selected={false} quantity={0} />
            </div>
          </section>
        </div>

        <aside className="overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white">
          <div className="bg-gradient-to-br from-[#0c4b47] via-[#0e8a80] to-[#12cdbe] px-4 py-3.5 text-white">
            <div className="flex items-center">
              <h3 className="text-[12.5px] font-semibold">Order summary</h3>
              <span className="ml-auto rounded-full bg-white/20 px-2 py-1 font-mono text-[9px]">
                {quantitiesAdjusted ? 5 : orderItems.length} pcs
              </span>
            </div>
            <p className="mt-1 text-[9.5px] text-white/75">
              {orderItems.length} line{' '}
              {orderItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {orderItems.length ? (
            <div>
              {orderItems.map((item) => {
                const product = productFor(item.productId);
                const quantity =
                  quantitiesAdjusted || item.productId === 107
                    ? item.quantity
                    : 1;
                return (
                  <div
                    key={item.id}
                    className="border-b border-[#edf1f0] px-4 py-3"
                  >
                    <div className="flex items-start">
                      <p className="min-w-0 flex-1 truncate text-[10.5px] font-semibold">
                        {product.title}
                      </p>
                      <span className="text-[9px] text-[#93a5a5]">×</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center overflow-hidden rounded-[8px] border border-[#e3e9e8]">
                        <span className="grid size-6 place-items-center bg-[#f8fafa]">
                          <Minus className="size-2.5" />
                        </span>
                        <span className="grid h-6 w-8 place-items-center border-x border-[#e3e9e8] font-mono text-[10px]">
                          {quantity}
                        </span>
                        <span className="grid size-6 place-items-center bg-[#f8fafa]">
                          <Plus className="size-2.5" />
                        </span>
                      </div>
                      <span className="ml-auto font-mono text-[10.5px]">
                        {formatCurrency(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <ShoppingBag className="mx-auto size-6 text-[#93a5a5]" />
              <p className="mt-2 text-[11px] font-semibold">No items yet</p>
              <p className="text-[9px] text-[#93a5a5]">
                Add products to build this order.
              </p>
            </div>
          )}
          <div className="border-t border-[#edf1f0] bg-[#fbfcfc] px-4 py-3.5">
            <div className="flex text-[10px] text-[#5f7273]">
              <span>Subtotal</span>
              <span className="ml-auto font-mono">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="mt-3 flex items-baseline border-t border-[#e3e9e8] pt-2.5">
              <span className="text-[11px] font-semibold">Total</span>
              <span className="ml-auto text-[19px] font-semibold tracking-[-.03em]">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div
              className={`mt-3 grid h-10 place-items-center rounded-[11px] text-[11px] font-semibold text-white ${orderItems.length ? 'bg-[#0c4b47]' : 'bg-[#9cafad]'}`}
            >
              {frame >= 565 && frame < 610 ? 'Placing order…' : 'Place order'}
            </div>
            <p className="mt-2 text-center text-[9px] text-[#93a5a5]">
              Saved as pending · stock moves when work starts.
            </p>
          </div>
        </aside>
      </div>

      {frame >= 530 && frame < 575 && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-[#071513]/25">
          <div className="w-[350px] overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,.5)]">
            <div className="h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
            <div className="p-5">
              <h3 className="text-[14px] font-semibold">Place this order?</h3>
              <p className="mt-1.5 text-[10.5px] leading-5 text-[#5f7273]">
                Review the order details and products before placing it in the
                pending queue.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <span className="rounded-[10px] border border-[#dce3e2] px-4 py-2 text-[10px]">
                  Cancel
                </span>
                <span className="rounded-[10px] bg-[#0c4b47] px-4 py-2 text-[10px] font-semibold text-white">
                  Place order
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {frame >= 565 && (
        <div className="absolute right-6 top-[76px] z-[70] w-[250px] rounded-[13px] border border-[#c2e7e2] bg-white px-4 py-3 shadow-[0_18px_40px_-24px_rgba(12,75,71,.7)]">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-6 place-items-center rounded-full bg-[#e4f7f4] text-[#00706a]">
              <Check className="size-3.5" />
            </span>
            <span>
              <strong className="block text-[10.5px]">
                {frame < 610 ? 'Placing order...' : 'Order created'}
              </strong>
              <span className="mt-0.5 block text-[9px] text-[#7c8e8e]">
                {frame < 610
                  ? 'Saving Juan’s Merienda Pack'
                  : 'Added to the pending queue.'}
              </span>
            </span>
          </div>
        </div>
      )}
    </AppShell>
  );
};
