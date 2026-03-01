import { useStore } from '../../store/useStore';
import '../../styles/stepper.css';

const STEPS = ['Configure', 'Export'];

export function TopStepper() {
  const activeStep = useStore(s => s.activeStep);
  const setActiveStep = useStore(s => s.setActiveStep);
  const isValid = useStore(s => s.layout.isValid);
  const resetParams = useStore(s => s.resetParams);

  return (
    <div className="top-stepper no-print">
      <div className="stepper-brand">TK8200 Planner</div>
      <div className="stepper-steps">
        {STEPS.map((label, i) => (
          <button
            key={i}
            className={`stepper-step ${activeStep === i ? 'active' : ''}`}
            disabled={i > 0 && !isValid}
            onClick={() => setActiveStep(i)}
          >
            <span className="step-number">{i + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <div className="stepper-right">
        <button className="btn-reset" onClick={resetParams}>
          Reset
        </button>
      </div>
    </div>
  );
}
