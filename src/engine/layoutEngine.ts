import type { LayoutParams, LayoutResult, Segment, GlassPanel } from '../types';
import { BASE_SHOE_PROFILES } from '../constants/profiles';
import { dividePanels } from './panelDivision';
import { computeCornerGeometry } from './cornerHandler';
import { validateParams } from './validation';

function buildPanels(
  panelCount: number,
  panelWidth: number,
  segmentIndex: number,
  segmentLabel: string,
  params: LayoutParams,
  edgeClearanceStart: number,
): GlassPanel[] {
  const profile = BASE_SHOE_PROFILES.find(p => p.id === params.baseShoeProfileId);
  const channelDepth = profile?.channelDepth ?? 100;
  const panelHeight = params.systemHeight - channelDepth;
  const panels: GlassPanel[] = [];

  for (let i = 0; i < panelCount; i++) {
    const x = edgeClearanceStart + i * (panelWidth + params.panelGap);
    panels.push({
      id: `${segmentLabel}${i + 1}`,
      segmentIndex,
      panelIndex: i,
      x,
      y: 0,
      width: panelWidth,
      height: panelHeight,
      thickness: params.glassThickness,
    });
  }

  return panels;
}

export function computeLayout(params: LayoutParams): LayoutResult {
  const errors = validateParams(params);
  if (errors.some(e => e.severity === 'error')) {
    return { segments: [], totalPanelCount: 0, isValid: false, validationErrors: errors };
  }

  const segments: Segment[] = [];

  if (params.layoutType === 'straight') {
    const effectiveLength = params.segmentALength - 2 * params.edgeClearance;
    const division = dividePanels(
      effectiveLength,
      params.panelGap,
      params.minPanelWidth,
      params.maxPanelWidth,
    );
    const panels = buildPanels(
      division.panelCount,
      division.panelWidth,
      0,
      'A',
      params,
      params.edgeClearance,
    );
    segments.push({
      index: 0,
      label: 'A',
      length: params.segmentALength,
      effectiveLength,
      angle: 0,
      originX: 0,
      originY: 0,
      panels,
    });
  } else {
    // L-shape
    const corner = computeCornerGeometry(
      params.segmentALength,
      params.segmentBLength,
      params.edgeClearance,
      params.cornerGap,
    );

    const divA = dividePanels(
      corner.effectiveA,
      params.panelGap,
      params.minPanelWidth,
      params.maxPanelWidth,
    );
    const panelsA = buildPanels(
      divA.panelCount,
      divA.panelWidth,
      0,
      'A',
      params,
      params.edgeClearance,
    );
    segments.push({
      index: 0,
      label: 'A',
      length: params.segmentALength,
      effectiveLength: corner.effectiveA,
      angle: 0,
      originX: 0,
      originY: 0,
      panels: panelsA,
    });

    const divB = dividePanels(
      corner.effectiveB,
      params.panelGap,
      params.minPanelWidth,
      params.maxPanelWidth,
    );
    const panelsB = buildPanels(
      divB.panelCount,
      divB.panelWidth,
      1,
      'B',
      params,
      params.cornerGap / 2,
    );
    segments.push({
      index: 1,
      label: 'B',
      length: params.segmentBLength,
      effectiveLength: corner.effectiveB,
      angle: 90,
      originX: corner.cornerVertex.x,
      originY: corner.cornerVertex.y,
      panels: panelsB,
    });
  }

  const totalPanelCount = segments.reduce((sum, s) => sum + s.panels.length, 0);
  return { segments, totalPanelCount, isValid: true, validationErrors: errors };
}
