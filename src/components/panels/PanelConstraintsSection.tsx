import { useStore } from '../../store/useStore';

export function PanelConstraintsSection() {
  const params = useStore(s => s.params);
  const setParam = useStore(s => s.setParam);

  return (
    <>
      <div className="param-row">
        <label className="param-label">
          Panel Gap <span className="param-unit">(mm)</span>
        </label>
        <input
          className="param-input"
          type="number"
          min={0}
          max={50}
          step={1}
          value={params.panelGap}
          onChange={e => setParam('panelGap', Number(e.target.value))}
        />
      </div>
      <div className="param-row">
        <label className="param-label">
          Min Panel Width <span className="param-unit">(mm)</span>
        </label>
        <input
          className="param-input"
          type="number"
          min={100}
          max={2000}
          step={50}
          value={params.minPanelWidth}
          onChange={e => setParam('minPanelWidth', Number(e.target.value))}
        />
      </div>
      <div className="param-row">
        <label className="param-label">
          Max Panel Width <span className="param-unit">(mm)</span>
        </label>
        <input
          className="param-input"
          type="number"
          min={100}
          max={3000}
          step={50}
          value={params.maxPanelWidth}
          onChange={e => setParam('maxPanelWidth', Number(e.target.value))}
        />
      </div>
      <div className="param-row">
        <label className="param-label">
          Edge Clearance <span className="param-unit">(mm)</span>
        </label>
        <input
          className="param-input"
          type="number"
          min={0}
          max={200}
          step={5}
          value={params.edgeClearance}
          onChange={e => setParam('edgeClearance', Number(e.target.value))}
        />
      </div>
      {params.layoutType === 'l-shape' && (
        <div className="param-row">
          <label className="param-label">
            Corner Gap <span className="param-unit">(mm)</span>
          </label>
          <input
            className="param-input"
            type="number"
            min={0}
            max={100}
            step={5}
            value={params.cornerGap}
            onChange={e => setParam('cornerGap', Number(e.target.value))}
          />
        </div>
      )}
    </>
  );
}
