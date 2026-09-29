import { ClipboardList, Package, ReceiptText, UserRound } from 'lucide-react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { BrandBackdrop } from '../components/BrandBackdrop';
import type { VideoLayout } from '../types';

type OpeningSceneProps = {
  layout: VideoLayout;
};

const fragments = [
  {
    label: 'Order #5026',
    detail: "Juan's Merienda Pack",
    icon: ClipboardList,
    x: 8,
    y: 12,
    rotate: -6,
  },
  {
    label: 'Stock alert',
    detail: 'Dried Mango · 9 left',
    icon: Package,
    x: 68,
    y: 11,
    rotate: 5,
  },
  {
    label: 'Expense',
    detail: 'MERALCO · ₱3,680.00',
    icon: ReceiptText,
    x: 71,
    y: 68,
    rotate: -4,
  },
  {
    label: 'Customer',
    detail: 'Juan Dela Cruz',
    icon: UserRound,
    x: 10,
    y: 72,
    rotate: 4,
  },
] as const;

export const OpeningScene = ({ layout }: OpeningSceneProps) => {
  const frame = useCurrentFrame();
  const logoVisible = interpolate(frame, [108, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <BrandBackdrop>
      {fragments.map(({ label, detail, icon: Icon, x, y, rotate }, index) => (
        <div
          key={label}
          className="absolute flex items-center gap-4 rounded-[22px] border border-white/15 bg-white/10 px-5 py-4 text-white shadow-[0_25px_60px_-32px_rgba(0,0,0,.7)] backdrop-blur-xl"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: layout === 'portrait' ? 360 : 340,
            opacity: interpolate(
              frame,
              [index * 12, index * 12 + 20, 112, 148],
              [0, 1, 1, 0.18],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              },
            ),
            translate: interpolate(
              frame,
              [0, 135],
              ['0px 0px', `${50 - x}px ${44 - y}px`],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            rotate: interpolate(frame, [0, 135], [`${rotate}deg`, '0deg'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            scale: interpolate(frame, [98, 148], [1, 0.72], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              output: 'perceptual-scale',
            }),
          }}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-[#12cdbe]/20 text-[#7fe0da]">
            <Icon className="size-6" />
          </span>
          <span>
            <strong className="block text-[15px]">{label}</strong>
            <span className="mt-1 block text-[12px] text-white/65">
              {detail}
            </span>
          </span>
        </div>
      ))}

      <AbsoluteFill className="flex items-center justify-center">
        <div
          className="text-center"
          style={{
            opacity: logoVisible,
            scale: interpolate(frame, [108, 160], [0.72, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.spring({ damping: 180 }),
              output: 'perceptual-scale',
            }),
          }}
        >
          <Img
            src={staticFile('negosyo-tracker-icon.png')}
            className="mx-auto size-28 rounded-full shadow-[0_20px_70px_-25px_rgba(18,205,190,.75)]"
          />
          <p className="mt-6 font-mono text-[17px] font-semibold uppercase tracking-[.2em] text-[#5eebdd]">
            NegosyoTracker
          </p>
          <h1
            className="mx-auto mt-4 max-w-[1100px] text-balance font-semibold leading-[.98] tracking-[-.055em] text-white"
            style={{ fontSize: layout === 'portrait' ? 82 : 94 }}
          >
            Your negosyo moves fast.
          </h1>
          <p className="mt-5 text-[30px] font-medium tracking-[-.02em] text-white/68">
            Your records should move together.
          </p>
        </div>
      </AbsoluteFill>
    </BrandBackdrop>
  );
};
