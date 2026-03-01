import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { RailingList } from './RailingList';
import { ProjectInfoSection } from './ProjectInfoSection';
import { GeometrySection } from './GeometrySection';
import { SystemSection } from './SystemSection';
import { PanelConstraintsSection } from './PanelConstraintsSection';
import { ValidationMessages } from './ValidationMessages';
import '../../styles/parameter-panel.css';

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="param-section">
      <div
        className={`param-section-header ${!open ? 'collapsed' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className="chevron">&#9660;</span>
      </div>
      {open && <div className="param-section-body">{children}</div>}
    </div>
  );
}

export function ParameterPanel() {
  const layout = useStore(s => s.layout);

  return (
    <div className="parameter-panel no-print">
      <RailingList />

      {layout.isValid && (
        <div className="panel-summary">
          Panels: <span>{layout.totalPanelCount}</span> &middot;
          Segments: <span>{layout.segments.length}</span>
          {layout.segments.length > 0 && (
            <> &middot; Width: <span>{Math.round(layout.segments[0].panels[0]?.width ?? 0)} mm</span></>
          )}
        </div>
      )}

      <Section title="Project Info">
        <ProjectInfoSection />
      </Section>

      <Section title="Geometry">
        <GeometrySection />
      </Section>

      <Section title="System">
        <SystemSection />
      </Section>

      <Section title="Panel Constraints">
        <PanelConstraintsSection />
      </Section>

      <ValidationMessages />
    </div>
  );
}
