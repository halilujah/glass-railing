import type { Segment } from '../../types';

interface Props {
  segment: Segment;
  scale: number;
}

export function PanelLabels({ segment, scale }: Props) {
  return (
    <g>
      {segment.panels.map(panel => {
        const cx = (panel.x + panel.width / 2) * scale;
        const cy = (panel.height / 2) * scale;
        return (
          <text key={panel.id} className="panel-label" x={cx} y={cy}>
            {panel.id}
          </text>
        );
      })}
    </g>
  );
}
