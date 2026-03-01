import { useStore } from '../../store/useStore';
import type { LayoutType } from '../../types';

export function GeometrySection() {
  const params = useStore(s => s.params);
  const setParam = useStore(s => s.setParam);

  return (
    <>
      <div className="param-row">
        <label className="param-label">Layout Type</label>
        <div className="param-radio-group">
          {(['straight', 'l-shape'] as LayoutType[]).map(type => (
            <button
              key={type}
              className={`param-radio-btn ${params.layoutType === type ? 'active' : ''}`}
              onClick={() => setParam('layoutType', type)}
            >
              {type === 'straight' ? 'Straight' : 'L-Shape'}
            </button>
          ))}
        </div>
      </div>
      <div className="param-row">
        <label className="param-label">
          Segment A Length <span className="param-unit">(mm)</span>
        </label>
        <input
          className="param-input"
          type="number"
          min={200}
          max={20000}
          step={100}
          value={params.segmentALength}
          onChange={e => setParam('segmentALength', Number(e.target.value))}
        />
      </div>
      {params.layoutType === 'l-shape' && (
        <>
          <div className="param-row">
            <label className="param-label">
              Segment B Length <span className="param-unit">(mm)</span>
            </label>
            <input
              className="param-input"
              type="number"
              min={200}
              max={20000}
              step={100}
              value={params.segmentBLength}
              onChange={e => setParam('segmentBLength', Number(e.target.value))}
            />
          </div>
          <div className="param-row">
            <label className="param-label">Corner Angle</label>
            <span className="param-badge">90°</span>
          </div>
        </>
      )}
    </>
  );
}
