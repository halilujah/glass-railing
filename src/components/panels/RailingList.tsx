import { useState } from 'react';
import { useStore } from '../../store/useStore';

export function RailingList() {
  const railings = useStore(s => s.railings);
  const activeRailingId = useStore(s => s.activeRailingId);
  const addRailing = useStore(s => s.addRailing);
  const removeRailing = useStore(s => s.removeRailing);
  const setActiveRailing = useStore(s => s.setActiveRailing);
  const renameRailing = useStore(s => s.renameRailing);
  const duplicateRailing = useStore(s => s.duplicateRailing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startRename = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const commitRename = () => {
    if (editingId && editName.trim()) {
      renameRailing(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="railing-list">
      <div className="railing-list-header">
        <span className="railing-list-title">Railings</span>
        <button className="railing-add-btn" onClick={addRailing} title="Add railing">
          + Add
        </button>
      </div>
      <div className="railing-items">
        {railings.map(r => {
          const isActive = r.id === activeRailingId;
          const isEditing = r.id === editingId;
          return (
            <div
              key={r.id}
              className={`railing-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveRailing(r.id)}
            >
              {isEditing ? (
                <input
                  className="railing-name-input"
                  value={editName}
                  autoFocus
                  onChange={e => setEditName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitRename();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span
                  className="railing-name"
                  onDoubleClick={e => {
                    e.stopPropagation();
                    startRename(r.id, r.name);
                  }}
                >
                  {r.name}
                </span>
              )}
              <span className="railing-info">
                {r.layout.isValid
                  ? `${r.layout.totalPanelCount}p · ${r.params.layoutType === 'straight' ? 'Str' : 'L'}`
                  : 'Invalid'}
              </span>
              <div className="railing-actions">
                <button
                  className="railing-action-btn"
                  title="Duplicate"
                  onClick={e => { e.stopPropagation(); duplicateRailing(r.id); }}
                >
                  &#x2398;
                </button>
                {railings.length > 1 && (
                  <button
                    className="railing-action-btn delete"
                    title="Remove"
                    onClick={e => { e.stopPropagation(); removeRailing(r.id); }}
                  >
                    &#x2715;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
