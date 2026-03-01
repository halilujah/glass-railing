import type { LayoutResult, LayoutParams, BomResult, BomGlassItem, BomProfileItem, BomAccessoryItem } from '../types';

export function generateBom(layout: LayoutResult, params: LayoutParams): BomResult {
  if (!layout.isValid) {
    return { glassItems: [], profileItems: [], accessoryItems: [] };
  }

  // Glass items — group by (width, height, thickness)
  const glassMap = new Map<string, BomGlassItem>();
  for (const segment of layout.segments) {
    for (const panel of segment.panels) {
      const w = Math.round(panel.width);
      const h = Math.round(panel.height);
      const key = `${w}x${h}x${panel.thickness}`;
      const existing = glassMap.get(key);
      if (existing) {
        existing.qty++;
        existing.panelId += `, ${panel.id}`;
      } else {
        glassMap.set(key, {
          panelId: panel.id,
          width: w,
          height: h,
          thickness: panel.thickness,
          qty: 1,
        });
      }
    }
  }
  const glassItems = Array.from(glassMap.values());

  // Profile items — one base shoe per segment
  const profileItems: BomProfileItem[] = layout.segments.map(seg => ({
    description: `Base Shoe – Segment ${seg.label}`,
    length: Math.round(seg.length),
    qty: 1,
  }));

  // Accessories — vary by mounting type
  const totalPanels = layout.totalPanelCount;
  const totalSegments = layout.segments.length;
  const totalLength = layout.segments.reduce((s, seg) => s + seg.length, 0);
  const accessoryItems: BomAccessoryItem[] = [
    { description: 'Wedge Gasket (per panel side)', qty: totalPanels * 2 },
    { description: 'End Cap', qty: totalSegments * 2 },
  ];

  if (params.mountingType === 'top-mount') {
    accessoryItems.push(
      { description: 'Top-Mount Anchor Bolt', qty: totalSegments * Math.ceil(totalLength / totalSegments / 300) },
      { description: 'Base Shoe Shim', qty: totalSegments * 4 },
    );
  } else if (params.mountingType === 'side-mount') {
    const bracketCount = Math.ceil(totalLength / 400);
    accessoryItems.push(
      { description: 'Side-Mount L-Bracket', qty: bracketCount },
      { description: 'Through-Bolt M10', qty: bracketCount * 2 },
      { description: 'Wall Spacer', qty: bracketCount },
    );
  } else {
    // core-drill
    const postCount = Math.ceil(totalLength / 500);
    accessoryItems.push(
      { description: 'Core-Drill Spigot', qty: postCount },
      { description: 'Chemical Anchor Capsule', qty: postCount },
      { description: 'Levelling Plate', qty: postCount },
    );
  }

  return { glassItems, profileItems, accessoryItems };
}
