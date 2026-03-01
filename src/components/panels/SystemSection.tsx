import { useStore } from '../../store/useStore';
import { BASE_SHOE_PROFILES } from '../../constants/profiles';
import type { MountingType } from '../../types';

const MOUNTING_TYPES: { value: MountingType; label: string }[] = [
  { value: 'top-mount', label: 'Top' },
  { value: 'side-mount', label: 'Side' },
  { value: 'core-drill', label: 'Core' },
];

export function SystemSection() {
  const params = useStore(s => s.params);
  const setParam = useStore(s => s.setParam);

  const selectedProfile = BASE_SHOE_PROFILES.find(p => p.id === params.baseShoeProfileId);
  const availableThicknesses = selectedProfile?.compatibleThicknesses ?? [10, 12, 15];

  return (
    <>
      <div className="param-row">
        <label className="param-label">
          System Height <span className="param-unit">(mm)</span>
        </label>
        <input
          className="param-input"
          type="number"
          min={500}
          max={2000}
          step={50}
          value={params.systemHeight}
          onChange={e => setParam('systemHeight', Number(e.target.value))}
        />
      </div>
      <div className="param-row">
        <label className="param-label">Base Shoe Profile</label>
        <select
          className="param-select"
          value={params.baseShoeProfileId}
          onChange={e => setParam('baseShoeProfileId', e.target.value)}
        >
          {BASE_SHOE_PROFILES.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="param-row">
        <label className="param-label">
          Glass Thickness <span className="param-unit">(mm)</span>
        </label>
        <select
          className="param-select"
          value={params.glassThickness}
          onChange={e => setParam('glassThickness', Number(e.target.value))}
        >
          {availableThicknesses.map(t => (
            <option key={t} value={t}>{t} mm</option>
          ))}
        </select>
      </div>
      <div className="param-row">
        <label className="param-label">Mounting Type</label>
        <div className="param-radio-group">
          {MOUNTING_TYPES.map(mt => (
            <button
              key={mt.value}
              className={`param-radio-btn ${params.mountingType === mt.value ? 'active' : ''}`}
              onClick={() => setParam('mountingType', mt.value)}
            >
              {mt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
