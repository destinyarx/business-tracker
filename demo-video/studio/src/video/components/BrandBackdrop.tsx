import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

type BrandBackdropProps = {
  children: ReactNode;
  tone?: 'ink' | 'light';
};

export const BrandBackdrop = ({
  children,
  tone = 'ink',
}: BrandBackdropProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: tone === 'ink' ? '#071513' : '#edf3f1',
        color: tone === 'ink' ? '#f7fbfa' : '#16292b',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          opacity: tone === 'ink' ? 0.8 : 0.35,
          background:
            tone === 'ink'
              ? 'radial-gradient(circle at 18% 15%, rgba(18,205,190,.33), transparent 27%), radial-gradient(circle at 82% 72%, rgba(29,78,216,.24), transparent 30%), radial-gradient(circle at 55% 105%, rgba(168,217,124,.18), transparent 28%)'
              : 'radial-gradient(circle at 12% 12%, rgba(18,205,190,.23), transparent 25%), radial-gradient(circle at 86% 76%, rgba(168,217,124,.22), transparent 28%)',
          scale: interpolate(frame, [0, 320], [1, 1.08], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
          rotate: interpolate(frame, [0, 320], ['0deg', '2deg'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: tone === 'ink' ? 0.15 : 0.1,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          translate: interpolate(frame, [0, 320], ['0px 0px', '-28px -18px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
