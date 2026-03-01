export type LayoutType = 'straight' | 'l-shape';

export type MountingType = 'top-mount' | 'side-mount' | 'core-drill';

export interface BaseShoeProfile {
  id: string;
  name: string;
  channelDepth: number;   // mm
  flangeWidth: number;    // mm
  compatibleThicknesses: number[]; // glass thicknesses in mm
}

export interface GlassPanel {
  id: string;           // e.g. "A1", "A2", "B1"
  segmentIndex: number;
  panelIndex: number;
  x: number;            // position along run from segment origin (mm)
  y: number;            // perpendicular offset (mm)
  width: number;        // mm
  height: number;       // mm
  thickness: number;    // mm
}

export interface Segment {
  index: number;
  label: string;          // "A", "B"
  length: number;         // total segment length (mm)
  effectiveLength: number;
  angle: number;          // degrees from horizontal
  originX: number;        // world-space origin
  originY: number;
  panels: GlassPanel[];
}

export interface LayoutResult {
  segments: Segment[];
  totalPanelCount: number;
  isValid: boolean;
  validationErrors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface LayoutParams {
  projectName: string;
  clientName: string;
  layoutType: LayoutType;
  segmentALength: number;       // mm
  segmentBLength: number;       // mm (only for L-shape)
  cornerAngle: number;          // degrees
  systemHeight: number;         // mm
  glassThickness: number;       // mm
  baseShoeProfileId: string;
  mountingType: MountingType;
  panelGap: number;             // mm
  minPanelWidth: number;        // mm
  maxPanelWidth: number;        // mm
  edgeClearance: number;        // mm each end
  cornerGap: number;            // mm at corner junction
}

export interface BomGlassItem {
  panelId: string;
  width: number;
  height: number;
  thickness: number;
  qty: number;
}

export interface BomProfileItem {
  description: string;
  length: number;
  qty: number;
}

export interface BomAccessoryItem {
  description: string;
  qty: number;
}

export interface BomResult {
  glassItems: BomGlassItem[];
  profileItems: BomProfileItem[];
  accessoryItems: BomAccessoryItem[];
}

export interface Railing {
  id: string;
  name: string;
  params: LayoutParams;
  layout: LayoutResult;
  bom: BomResult;
}
