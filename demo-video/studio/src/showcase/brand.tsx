import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadPlexMono } from '@remotion/google-fonts/IBMPlexMono';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import type { ReactNode } from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Same families as the landing page (Poppins + IBM Plex Mono) and the app (Inter).
export const display = loadPoppins('normal', {
  weights: ['500', '600', '700'],
  subsets: ['latin'],
}).fontFamily;
loadInter('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
loadPlexMono('normal', { weights: ['400', '500'], subsets: ['latin'] });

export const ink = '#16292b';
export const inkTeal = '#0c4b47';
export const teal = '#12cdbe';
export const deepTeal = '#007f78';
export const muted = '#5a6b6b';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

export const fadeUp = (frame: number, at: number, distance = 30) => ({
  opacity: interpolate(frame, [at, at + 18], [0, 1], clamp),
  translate: `0px ${interpolate(frame, [at, at + 28], [distance, 0], { ...clamp, easing: outExpo })}px`,
});

export const usePop = (at: number, damping = 14): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass: 0.7 } });
};

// Mirrors the landing hero: mint radial wash, faint ink grid, lime/teal/yellow glows.
export const BrandCanvas = ({ children }: { children: ReactNode }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: ink,
        fontFamily: 'Inter, sans-serif',
        background:
          'radial-gradient(120% 90% at 84% -18%, #C9F2E4 0%, #EAF6EF 42%, #F4F8F6 72%, #F4F8F6 100%)',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage:
            'linear-gradient(#0C4B47 1px, transparent 1px), linear-gradient(90deg, #0C4B47 1px, transparent 1px)',
          backgroundSize: '68px 68px',
          translate: `0px ${-frame * 0.15}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -180 + drift,
          top: -380,
          width: 980,
          height: 980,
          borderRadius: 9999,
          opacity: 0.5,
          filter: 'blur(110px)',
          background:
            'conic-gradient(from 210deg, #A8D97C, #12CDBE 38%, #7FE0DA 62%, #A8D97C)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -260 - drift,
          bottom: -420,
          width: 820,
          height: 820,
          borderRadius: 9999,
          opacity: 0.32,
          filter: 'blur(120px)',
          background: 'linear-gradient(150deg, #FFDE68, #A8D97C 70%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

type CaptionProps = {
  step: string;
  title: string;
  body: string;
  at?: number;
};

// Lower-third that names the step, so each scene reads without sound.
export const Caption = ({ step, title, body, at = 12 }: CaptionProps) => {
  const frame = useCurrentFrame();
  const words = title.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        bottom: 64,
        zIndex: 90,
        maxWidth: 860,
        padding: '26px 34px 28px',
        borderRadius: 28,
        background: 'rgba(255,255,255,.92)',
        border: '1px solid #E3E9E8',
        boxShadow: '0 34px 70px -34px rgba(12,75,71,.55)',
        ...fadeUp(frame, at, 40),
      }}
    >
      <div
        className="font-mono"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: deepTeal,
        }}
      >
        <span
          style={{ width: 9, height: 9, borderRadius: 9, background: teal }}
        />
        {step}
      </div>
      <h2
        style={{
          margin: '12px 0 0',
          fontFamily: display,
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: '-.035em',
          color: ink,
        }}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              marginRight: '0.26em',
              ...fadeUp(frame, at + 6 + index * 3, 18),
            }}
          >
            {word}
          </span>
        ))}
      </h2>
      <p
        style={{
          margin: '12px 0 0',
          fontSize: 22,
          lineHeight: 1.45,
          color: muted,
          ...fadeUp(frame, at + 20, 14),
        }}
      >
        {body}
      </p>
    </div>
  );
};

type CalloutProps = {
  at: number;
  x: number;
  y: number;
  eyebrow: string;
  title: string;
  rows?: readonly (readonly [string, string])[];
  accent?: string;
  until?: number;
};

// Floating result card in screen space: states the outcome the UI just produced.
export const Callout = ({
  at,
  x,
  y,
  eyebrow,
  title,
  rows = [],
  accent = teal,
  until = 100000,
}: CalloutProps) => {
  const frame = useCurrentFrame();
  const pop = usePop(at) * interpolate(frame, [until, until + 14], [1, 0], clamp);
  if (frame < at || frame > until + 14) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 95,
        width: 440,
        borderRadius: 26,
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid #E3E9E8',
        boxShadow: '0 40px 80px -36px rgba(12,75,71,.6)',
        opacity: pop,
        scale: String(interpolate(pop, [0, 1], [0.86, 1])),
        translate: `0px ${interpolate(pop, [0, 1], [26, 0])}px`,
      }}
    >
      <div
        style={{
          height: 5,
          background: `linear-gradient(90deg, ${accent}, #A8D97C)`,
        }}
      />
      <div style={{ padding: '22px 28px 24px' }}>
        <div
          className="font-mono"
          style={{
            fontSize: 15,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: deepTeal,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: '-.03em',
            color: ink,
          }}
        >
          {title}
        </div>
        {rows.map(([label, value], index) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: index === 0 ? 16 : 10,
              paddingTop: 10,
              borderTop: '1px dashed #E3E9E8',
              fontSize: 20,
              ...fadeUp(frame, at + 10 + index * 6, 10),
            }}
          >
            <span style={{ color: muted }}>{label}</span>
            <span
              className="font-mono"
              style={{ marginLeft: 'auto', fontWeight: 500, color: ink }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
