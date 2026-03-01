import { create } from 'zustand';
import type { LayoutParams, LayoutResult, BomResult, Railing } from '../types';
import { computeLayout } from '../engine/layoutEngine';
import { generateBom } from '../engine/bomGenerator';
import { DEFAULT_PARAMS } from '../constants/defaults';

let nextId = 1;

function recompute(params: LayoutParams) {
  const layout = computeLayout(params);
  const bom = generateBom(layout, params);
  return { layout, bom };
}

function createRailing(name: string, paramsOverride?: Partial<LayoutParams>): Railing {
  const params = { ...DEFAULT_PARAMS, ...paramsOverride };
  const { layout, bom } = recompute(params);
  return { id: String(nextId++), name, params, layout, bom };
}

function mergeBoms(railings: Railing[]): BomResult {
  const prefix = railings.length > 1;
  const glassItems = railings.flatMap(r =>
    r.bom.glassItems.map(item => ({
      ...item,
      panelId: prefix ? `${r.name}: ${item.panelId}` : item.panelId,
    })),
  );
  const profileItems = railings.flatMap(r =>
    r.bom.profileItems.map(item => ({
      ...item,
      description: prefix ? `${r.name} – ${item.description}` : item.description,
    })),
  );
  const accMap = new Map<string, number>();
  for (const r of railings) {
    for (const item of r.bom.accessoryItems) {
      accMap.set(item.description, (accMap.get(item.description) ?? 0) + item.qty);
    }
  }
  const accessoryItems = Array.from(accMap, ([description, qty]) => ({ description, qty }));
  return { glassItems, profileItems, accessoryItems };
}

const firstRailing = createRailing('Railing 1');

interface AppState {
  // Multi-railing
  railings: Railing[];
  activeRailingId: string;

  // Derived from active railing (convenience for existing components)
  params: LayoutParams;
  layout: LayoutResult;
  bom: BomResult;
  totalBom: BomResult;

  activeStep: number;
  selectedPanelId: string | null;

  // Railing management
  addRailing: () => void;
  removeRailing: (id: string) => void;
  setActiveRailing: (id: string) => void;
  renameRailing: (id: string, name: string) => void;
  duplicateRailing: (id: string) => void;

  // Param editing (applies to active railing)
  setParam: <K extends keyof LayoutParams>(key: K, value: LayoutParams[K]) => void;
  setParams: (partial: Partial<LayoutParams>) => void;
  resetParams: () => void;

  setActiveStep: (step: number) => void;
  setSelectedPanelId: (id: string | null) => void;
}

function derive(railings: Railing[], activeId: string) {
  const active = railings.find(r => r.id === activeId) ?? railings[0];
  return {
    params: active.params,
    layout: active.layout,
    bom: active.bom,
    totalBom: mergeBoms(railings),
  };
}

export const useStore = create<AppState>((set, get) => ({
  railings: [firstRailing],
  activeRailingId: firstRailing.id,
  ...derive([firstRailing], firstRailing.id),
  activeStep: 0,
  selectedPanelId: null,

  addRailing: () => {
    const { railings } = get();
    const r = createRailing(`Railing ${railings.length + 1}`);
    const updated = [...railings, r];
    set({ railings: updated, activeRailingId: r.id, ...derive(updated, r.id) });
  },

  removeRailing: (id) => {
    const { railings, activeRailingId } = get();
    if (railings.length <= 1) return;
    const updated = railings.filter(r => r.id !== id);
    const newId = activeRailingId === id ? updated[0].id : activeRailingId;
    set({ railings: updated, activeRailingId: newId, ...derive(updated, newId) });
  },

  setActiveRailing: (id) => {
    const { railings } = get();
    set({ activeRailingId: id, selectedPanelId: null, ...derive(railings, id) });
  },

  renameRailing: (id, name) => {
    const { railings, activeRailingId } = get();
    const updated = railings.map(r => (r.id === id ? { ...r, name } : r));
    set({ railings: updated, ...derive(updated, activeRailingId) });
  },

  duplicateRailing: (id) => {
    const { railings } = get();
    const source = railings.find(r => r.id === id);
    if (!source) return;
    const dup = createRailing(`${source.name} (copy)`, source.params);
    const updated = [...railings, dup];
    set({ railings: updated, activeRailingId: dup.id, ...derive(updated, dup.id) });
  },

  setParam: (key, value) => {
    const { railings, activeRailingId } = get();
    const updated = railings.map(r => {
      if (r.id !== activeRailingId) return r;
      const p = { ...r.params, [key]: value };
      return { ...r, params: p, ...recompute(p) };
    });
    set({ railings: updated, ...derive(updated, activeRailingId) });
  },

  setParams: (partial) => {
    const { railings, activeRailingId } = get();
    const updated = railings.map(r => {
      if (r.id !== activeRailingId) return r;
      const p = { ...r.params, ...partial };
      return { ...r, params: p, ...recompute(p) };
    });
    set({ railings: updated, ...derive(updated, activeRailingId) });
  },

  resetParams: () => {
    const { railings, activeRailingId } = get();
    const updated = railings.map(r => {
      if (r.id !== activeRailingId) return r;
      return { ...r, params: DEFAULT_PARAMS, ...recompute(DEFAULT_PARAMS) };
    });
    set({ railings: updated, ...derive(updated, activeRailingId) });
  },

  setActiveStep: (step) => set({ activeStep: step }),
  setSelectedPanelId: (id) => set({ selectedPanelId: id }),
}));
