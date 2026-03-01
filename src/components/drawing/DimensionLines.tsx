import type { Segment, LayoutParams } from '../../types';

interface Props {
  segment: Segment;
  params: LayoutParams;
  scale: number;
}

function DimLine({
  x1, y1, x2, y2, label, offset,
}: {
  x1: number; y1: number; x2: number; y2: number; label: string; offset: number;
}) {
  const isHorizontal = Math.abs(y2 - y1) < 0.01;
  const arrowSize = 4;

  if (isHorizontal) {
    const dy = offset;
    const ly1 = y1 + dy;
    const midX = (x1 + x2) / 2;
    const textW = label.length * 6.5 + 8;
    const textH = 14;

    return (
      <g>
        {/* Extension lines */}
        <line className="dim-extension" x1={x1} y1={y1} x2={x1} y2={ly1 + (dy > 0 ? 4 : -4)} />
        <line className="dim-extension" x1={x2} y1={y2} x2={x2} y2={ly1 + (dy > 0 ? 4 : -4)} />
        {/* Main dim line */}
        <line className="dim-line" x1={x1} y1={ly1} x2={x2} y2={ly1} />
        {/* Arrows */}
        <polygon
          points={`${x1},${ly1} ${x1 + arrowSize},${ly1 - arrowSize / 2} ${x1 + arrowSize},${ly1 + arrowSize / 2}`}
          fill="#555"
        />
        <polygon
          points={`${x2},${ly1} ${x2 - arrowSize},${ly1 - arrowSize / 2} ${x2 - arrowSize},${ly1 + arrowSize / 2}`}
          fill="#555"
        />
        {/* Text background */}
        <rect
          className="dim-text-bg"
          x={midX - textW / 2}
          y={ly1 - textH / 2}
          width={textW}
          height={textH}
          rx={2}
        />
        {/* Text */}
        <text className="dim-text" x={midX} y={ly1}>
          {label}
        </text>
      </g>
    );
  }

  // Vertical dimension
  const dx = offset;
  const lx1 = x1 + dx;
  const midY = (y1 + y2) / 2;
  const textW = label.length * 6.5 + 8;
  const textH = 14;

  return (
    <g>
      <line className="dim-extension" x1={x1} y1={y1} x2={lx1 + (dx > 0 ? 4 : -4)} y2={y1} />
      <line className="dim-extension" x1={x2} y1={y2} x2={lx1 + (dx > 0 ? 4 : -4)} y2={y2} />
      <line className="dim-line" x1={lx1} y1={y1} x2={lx1} y2={y2} />
      <polygon
        points={`${lx1},${y1} ${lx1 - arrowSize / 2},${y1 + arrowSize} ${lx1 + arrowSize / 2},${y1 + arrowSize}`}
        fill="#555"
      />
      <polygon
        points={`${lx1},${y2} ${lx1 - arrowSize / 2},${y2 - arrowSize} ${lx1 + arrowSize / 2},${y2 - arrowSize}`}
        fill="#555"
      />
      <rect
        className="dim-text-bg"
        x={lx1 - textW / 2}
        y={midY - textH / 2}
        width={textW}
        height={textH}
        rx={2}
      />
      <text className="dim-text" x={lx1} y={midY}>
        {label}
      </text>
    </g>
  );
}

export function DimensionLines({ segment, params, scale }: Props) {
  const totalH = params.systemHeight * scale;
  const panelBottom = segment.panels[0]?.height ?? (params.systemHeight - 100);
  const panelBottomY = panelBottom * scale;
  const offsetBelow = 30;
  const offsetAbove = -15;

  return (
    <g>
      {/* Total segment length dimension — below base profile */}
      <DimLine
        x1={0}
        y1={totalH}
        x2={segment.length * scale}
        y2={totalH}
        label={`${Math.round(segment.length)} mm`}
        offset={offsetBelow}
      />

      {/* Individual panel width dimensions — above panels */}
      {segment.panels.map(panel => (
        <DimLine
          key={panel.id}
          x1={panel.x * scale}
          y1={0}
          x2={(panel.x + panel.width) * scale}
          y2={0}
          label={`${Math.round(panel.width)}`}
          offset={offsetAbove}
        />
      ))}

      {/* Height dimension — left side (only for first segment) */}
      {segment.index === 0 && (
        <DimLine
          x1={0}
          y1={0}
          x2={0}
          y2={totalH}
          label={`${Math.round(params.systemHeight)} mm`}
          offset={-40}
        />
      )}

      {/* Gap dimensions (small ticks between panels) */}
      {segment.panels.slice(0, -1).map((panel, i) => {
        const nextPanel = segment.panels[i + 1];
        const gapStart = (panel.x + panel.width) * scale;
        const gapEnd = nextPanel.x * scale;
        const gapWidth = gapEnd - gapStart;
        if (gapWidth < 2) return null;
        const midY = panelBottomY + 12;

        return (
          <g key={`gap-${i}`}>
            <line className="dim-extension" x1={gapStart} y1={panelBottomY - 5} x2={gapStart} y2={midY + 8} strokeDasharray="2 2" />
            <line className="dim-extension" x1={gapEnd} y1={panelBottomY - 5} x2={gapEnd} y2={midY + 8} strokeDasharray="2 2" />
            <text className="dim-text" x={(gapStart + gapEnd) / 2} y={midY + 4} style={{ fontSize: '9px' }}>
              {Math.round(params.panelGap)}
            </text>
          </g>
        );
      })}
    </g>
  );
}
