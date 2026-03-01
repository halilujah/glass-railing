import type { Segment, LayoutParams } from '../../types';
import { useStore } from '../../store/useStore';

interface Props {
  segment: Segment;
  params: LayoutParams;
  scale: number;
}

export function PanelRenderer({ segment, scale }: Props) {
  const selectedPanelId = useStore(s => s.selectedPanelId);
  const setSelectedPanelId = useStore(s => s.setSelectedPanelId);

  return (
    <g>
      {segment.panels.map(panel => {
        const px = panel.x * scale;
        const py = 0;
        const pw = panel.width * scale;
        const ph = panel.height * scale;
        const isSelected = selectedPanelId === panel.id;

        return (
          <rect
            key={panel.id}
            className={`glass-panel-rect ${isSelected ? 'selected' : ''}`}
            x={px}
            y={py}
            width={pw}
            height={ph}
            onClick={e => {
              e.stopPropagation();
              setSelectedPanelId(isSelected ? null : panel.id);
            }}
          />
        );
      })}
    </g>
  );
}
