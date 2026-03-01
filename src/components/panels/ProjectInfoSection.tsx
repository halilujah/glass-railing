import { useStore } from '../../store/useStore';

export function ProjectInfoSection() {
  const params = useStore(s => s.params);
  const setParam = useStore(s => s.setParam);

  return (
    <>
      <div className="param-row">
        <label className="param-label">Project Name</label>
        <input
          className="param-input"
          type="text"
          value={params.projectName}
          onChange={e => setParam('projectName', e.target.value)}
        />
      </div>
      <div className="param-row">
        <label className="param-label">Client</label>
        <input
          className="param-input"
          type="text"
          value={params.clientName}
          onChange={e => setParam('clientName', e.target.value)}
        />
      </div>
    </>
  );
}
