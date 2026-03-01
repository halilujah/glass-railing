import type { LayoutParams } from '../../types';

interface Props {
  params: LayoutParams;
  scale: number;
  cornerX: number;
  cornerY: number;
}

export function CornerAnnotation({ params, scale, cornerX, cornerY }: Props) {
  const cx = cornerX * scale;
  const cy = cornerY * scale;
  const r = 40;

  // Arc from 0° to -90° (segment A is horizontal, B goes up/left)
  const startX = cx + r;
  const startY = cy;
  const endX = cx;
  const endY = cy - r;

  return (
    <g>
      <path
        className="corner-arc"
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 0 ${endX} ${endY}`}
      />
      <text className="corner-label" x={cx + r * 0.55} y={cy - r * 0.55}>
        {params.cornerAngle}°
      </text>
      {params.cornerGap > 0 && (
        <text
          className="dim-text"
          x={cx + 8}
          y={cy + 16}
          style={{ fontSize: '10px', fill: '#2563eb' }}
        >
          gap: {params.cornerGap}mm
        </text>
      )}
    </g>
  );
}
