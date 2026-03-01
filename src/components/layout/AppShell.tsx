import { useStore } from '../../store/useStore';
import { TopStepper } from './TopStepper';
import { ParameterPanel } from '../panels/ParameterPanel';
import { DrawingViewport } from '../drawing/DrawingViewport';
import { ExportPanel } from '../export/ExportPanel';
import '../../styles/app-shell.css';

export function AppShell() {
  const activeStep = useStore(s => s.activeStep);

  return (
    <div className="app-shell">
      <TopStepper />
      <div className="main-content">
        {activeStep === 0 && <ParameterPanel />}
        <div className="center-area">
          {activeStep === 0 && <DrawingViewport />}
          {activeStep === 1 && <ExportPanel />}
        </div>
      </div>
    </div>
  );
}
