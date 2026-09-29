import type { LucideIcon } from 'lucide-react';
import {
  ChartNoAxesCombined,
  MessageCircle,
  PackageOpen,
  ReceiptText,
  ShoppingBag,
  StickyNote,
  Table2,
  UsersRound,
  Warehouse,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  BrandCanvas,
  deepTeal,
  display,
  fadeUp,
  ink,
  inkTeal,
  muted,
  outExpo,
  smooth,
  usePop,
} from './brand';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type Fragment = {
  icon: LucideIcon;
  label: string;
  text: string;
  x: number;
  y: number;
  rotate: number;
  at: number;
};

// The pain: records scattered across paper, chat and files. Taken from the demo fixture.
const fragments: Fragment[] = [
  { icon: StickyNote, label: 'Notebook', text: 'Juan – 2 ube box, 2 mango, 1 calamansi', x: 120, y: 150, rotate: -5, at: 4 },
  { icon: MessageCircle, label: 'Group chat', text: 'May stock pa ba ng dried mango?', x: 1270, y: 130, rotate: 4, at: 44 },
  { icon: Table2, label: 'Spreadsheet', text: 'sales_sept_FINAL_v3.xlsx', x: 1330, y: 800, rotate: -3, at: 84 },
  { icon: ReceiptText, label: 'Receipt', text: 'MERALCO bill · ₱3,680.00', x: 170, y: 790, rotate: 3, at: 64 },
];

const pains = ['Notebooks.', 'Group chats.', 'Spreadsheets.'];

export const HookScene = () => {
  const frame = useCurrentFrame();
  const collapse = interpolate(frame, [128, 158], [0, 1], {
    ...clamp,
    easing: smooth,
  });

  return (
    <BrandCanvas>
      {fragments.map((fragment) => {
        const Icon = fragment.icon;
        const float = Math.sin((frame + fragment.at * 3) / 28) * 8;
        const style: CSSProperties = {
          position: 'absolute',
          left: interpolate(collapse, [0, 1], [fragment.x, 830]),
          top: interpolate(collapse, [0, 1], [fragment.y + float, 500]),
          rotate: `${fragment.rotate * (1 - collapse)}deg`,
          scale: String(interpolate(collapse, [0, 1], [1, 0.3])),
          opacity:
            interpolate(frame, [fragment.at, fragment.at + 14], [0, 1], clamp) *
            (1 - collapse),
          width: 430,
          padding: '20px 24px',
          borderRadius: 22,
          background: '#fff',
          border: '1px solid #E3E9E8',
          boxShadow: '0 30px 60px -34px rgba(12,75,71,.5)',
        };
        return (
          <div key={fragment.label} style={style}>
            <div
              className="font-mono"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 15,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#93A5A5',
              }}
            >
              <Icon size={18} color={deepTeal} />
              {fragment.label}
            </div>
            <div style={{ marginTop: 10, fontSize: 24, fontWeight: 500 }}>
              {fragment.text}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 330,
          textAlign: 'center',
          fontFamily: display,
          opacity: 1 - collapse,
          scale: String(interpolate(collapse, [0, 1], [1, 0.9])),
        }}
      >
        {pains.map((pain, index) => {
          const at = 6 + index * 40;
          const strike = interpolate(frame, [at + 22, at + 38], [0, 100], {
            ...clamp,
            easing: outExpo,
          });
          return (
            <div
              key={pain}
              style={{
                position: 'relative',
                display: 'table',
                margin: '0 auto',
                fontSize: 104,
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-.045em',
                color: index === 2 ? ink : '#9AAAA9',
                ...fadeUp(frame, at, 40),
              }}
            >
              {pain}
              <span
                style={{
                  position: 'absolute',
                  left: -8,
                  top: '54%',
                  height: 8,
                  borderRadius: 8,
                  width: `calc(${strike}% + 16px)`,
                  opacity: strike > 0 ? 1 : 0,
                  background: '#DC2626',
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 400,
          textAlign: 'center',
          fontFamily: display,
          fontWeight: 600,
          letterSpacing: '-.045em',
        }}
      >
        <div
          style={{ fontSize: 112, lineHeight: 1.05, ...fadeUp(frame, 150, 50) }}
        >
          One place for
        </div>
        <div
          style={{
            fontSize: 112,
            lineHeight: 1.12,
            color: deepTeal,
            ...fadeUp(frame, 162, 50),
          }}
        >
          the whole negosyo.
        </div>
      </div>
    </BrandCanvas>
  );
};

type Module = {
  title: string;
  detail: string;
  icon: LucideIcon;
  tile: string;
  color: string;
};

// Module copy mirrors src/features/landing/landing.constants.ts.
const modules: Module[] = [
  { title: 'Customers', detail: 'Normal to VIP tiers', icon: UsersRound, tile: '#E8F7F5', color: '#007F78' },
  { title: 'Orders', detail: 'Pending → Completed', icon: ShoppingBag, tile: '#E6F0FE', color: '#1D4ED8' },
  { title: 'Products', detail: 'SKU, barcode, margin', icon: PackageOpen, tile: '#FFF4DB', color: '#8A6100' },
  { title: 'Inventory', detail: 'Low-stock flags', icon: Warehouse, tile: '#F3EEFF', color: '#5B34C7' },
  { title: 'Expenses', detail: 'Costs by category', icon: ReceiptText, tile: '#FDECEC', color: '#B01C1C' },
  { title: 'Sales', detail: 'Day, week, month', icon: ChartNoAxesCombined, tile: '#E7F7EC', color: '#166534' },
];

const ModuleTile = ({ module, at }: { module: Module; at: number }) => {
  const pop = usePop(at, 12);
  const Icon = module.icon;
  return (
    <div
      style={{
        width: 262,
        padding: '26px 24px',
        borderRadius: 26,
        background: '#fff',
        border: '1px solid #E3E9E8',
        boxShadow: '0 30px 60px -40px rgba(12,75,71,.55)',
        opacity: pop,
        translate: `0px ${interpolate(pop, [0, 1], [70, 0])}px`,
      }}
    >
      <span
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 58,
          height: 58,
          borderRadius: 16,
          background: module.tile,
        }}
      >
        <Icon size={28} color={module.color} strokeWidth={1.9} />
      </span>
      <div
        style={{
          marginTop: 20,
          fontFamily: display,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: '-.03em',
        }}
      >
        {module.title}
      </div>
      <div style={{ marginTop: 4, fontSize: 18, color: muted }}>
        {module.detail}
      </div>
    </div>
  );
};

export const BrandScene = () => {
  const frame = useCurrentFrame();
  const iconPop = usePop(4, 11);
  const headline = 'Your all-in-one business companion'.split(' ');

  return (
    <BrandCanvas>
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 26,
        }}
      >
        <Img
          src={staticFile('negosyo-tracker-icon.png')}
          style={{
            width: 112,
            height: 112,
            scale: String(iconPop),
            rotate: `${interpolate(iconPop, [0, 1], [-40, 0])}deg`,
          }}
        />
        <div
          style={{
            fontFamily: display,
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: '-.035em',
            color: '#203233',
            clipPath: `inset(0 ${interpolate(frame, [14, 44], [100, 0], { ...clamp, easing: outExpo })}% 0 0)`,
          }}
        >
          NegosyoTracker
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 318,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: display,
          fontSize: 68,
          fontWeight: 600,
          letterSpacing: '-.04em',
          color: ink,
        }}
      >
        {headline.map((word, index) => (
          <span
            key={word}
            style={{
              display: 'inline-block',
              marginRight: '0.24em',
              color: index >= 3 ? deepTeal : ink,
              ...fadeUp(frame, 40 + index * 5, 34),
            }}
          >
            {word}
          </span>
        ))}
        <div
          style={{
            marginTop: 16,
            fontFamily: 'Inter, sans-serif',
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '-.01em',
            color: muted,
            ...fadeUp(frame, 72, 20),
          }}
        >
          Built for small and medium businesses that outgrew the notebook.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 612,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 22,
        }}
      >
        {modules.map((module, index) => (
          <ModuleTile key={module.title} module={module} at={96 + index * 7} />
        ))}
      </div>
    </BrandCanvas>
  );
};

export const OutroScene = () => {
  const frame = useCurrentFrame();
  const iconPop = usePop(0, 11);
  const ctaPop = usePop(62, 12);

  return (
    <BrandCanvas>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Img
            src={staticFile('negosyo-tracker-icon.png')}
            style={{ width: 96, height: 96, scale: String(iconPop) }}
          />
          <span
            style={{
              fontFamily: display,
              fontSize: 60,
              fontWeight: 600,
              letterSpacing: '-.035em',
              color: '#203233',
              ...fadeUp(frame, 8, 20),
            }}
          >
            NegosyoTracker
          </span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: display,
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-.045em',
            color: ink,
            ...fadeUp(frame, 20, 40),
          }}
        >
          Track your business.
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-.045em',
            color: deepTeal,
            ...fadeUp(frame, 32, 40),
          }}
        >
          Grow with confidence.
        </div>
        <div
          className="font-mono"
          style={{
            marginTop: 30,
            fontSize: 20,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: '#6B7A7A',
            ...fadeUp(frame, 46, 16),
          }}
        >
          Customers · Orders · Products · Inventory · Expenses · Sales
        </div>
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: ctaPop,
            scale: String(interpolate(ctaPop, [0, 1], [0.9, 1])),
          }}
        >
          <span
            style={{
              padding: '24px 48px',
              borderRadius: 999,
              background: inkTeal,
              color: '#fff',
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Get started free
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '22px 32px',
              borderRadius: 999,
              background: '#fff',
              border: '1px solid #E3E9E8',
              color: deepTeal,
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            <span
              style={{ width: 10, height: 10, borderRadius: 10, background: '#12CDBE' }}
            />
            Free tier, no credit card
          </span>
        </div>
      </div>
    </BrandCanvas>
  );
};
