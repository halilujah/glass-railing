import type { Segment } from '../../types';

interface Props {
  segment: Segment;
  scale: number;
}

export function SegmentLabels({ segment, scale }: Props) {
  const midX = (segment.length / 2) * scale;
  const y = -20;

  return (
    <text className="segment-label" x={midX} y={y}>
      Segment {segment.label} ({Math.round(segment.length)} mm)
    </text>
  );
}
