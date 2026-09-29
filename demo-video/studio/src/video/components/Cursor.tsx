import { Easing, interpolate, useCurrentFrame } from 'remotion';

type CursorPoint = {
  frame: number;
  x: number;
  y: number;
};

type CursorProps = {
  points: readonly CursorPoint[];
  clickFrames?: readonly number[];
  hiddenBefore?: number;
};

export const Cursor = ({
  points,
  clickFrames = [],
  hiddenBefore = 0,
}: CursorProps) => {
  const frame = useCurrentFrame();
  const inputFrames = points.map((point) => point.frame);
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const isClicking = clickFrames.some(
    (clickFrame) => frame >= clickFrame && frame <= clickFrame + 8,
  );

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 80,
        left: interpolate(frame, inputFrames, xValues, {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        top: interpolate(frame, inputFrames, yValues, {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        opacity: interpolate(frame, [hiddenBefore, hiddenBefore + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        scale: isClicking ? 0.84 : 1,
        filter: 'drop-shadow(0 3px 5px rgba(5, 22, 20, .32))',
      }}
    >
      {isClicking && (
        <span
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 28,
            height: 28,
            borderRadius: 999,
            border: '2px solid rgba(18,205,190,.75)',
            scale: interpolate(
              frame,
              [
                clickFrames.find(
                  (clickFrame) =>
                    frame >= clickFrame && frame <= clickFrame + 8,
                ) ?? frame,
                frame + 8,
              ],
              [0.45, 1.45],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ),
          }}
        />
      )}
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
        <path
          d="M3 2.5 26.5 22l-10.2 1.5 5.8 10-5.1 2.9-5.6-10.1-6.5 7.8L3 2.5Z"
          fill="#fff"
          stroke="#0c2926"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
