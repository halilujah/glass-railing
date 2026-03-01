import type { LayoutParams, Segment, GlassPanel, Railing } from '../types';
import { DxfWriter } from './dxfWriter';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function worldCoords(
  panel: GlassPanel,
  segment: Segment,
  offsetY: number,
): { x: number; y: number } {
  if (segment.angle === 0) {
    return {
      x: segment.originX + panel.x,
      y: offsetY + segment.originY + panel.y,
    };
  }
  return {
    x: segment.originX - panel.y,
    y: offsetY + segment.originY + panel.x,
  };
}

function writeRailing(dxf: DxfWriter, railing: Railing, yOffset: number) {
  const layout = railing.layout;
  if (!layout.isValid) return;

  // Railing label
  dxf.addText(railing.name, 0, yOffset - 100, 60, 'TEXT');

  for (const segment of layout.segments) {
    const baseY = yOffset + segment.originY;
    if (segment.angle === 0) {
      dxf.addLine(
        segment.originX, baseY,
        segment.originX + segment.length, baseY,
        'BASE_PROFILE',
      );
    } else {
      dxf.addLine(
        segment.originX, yOffset + segment.originY,
        segment.originX, yOffset + segment.originY + segment.length,
        'BASE_PROFILE',
      );
    }

    for (const panel of segment.panels) {
      const wc = worldCoords(panel, segment, yOffset);
      if (segment.angle === 0) {
        dxf.addRect(wc.x, wc.y, panel.width, panel.height, 'GLASS_PANELS');
        dxf.addText(panel.id, wc.x + panel.width / 2, wc.y + panel.height / 2, 50, 'TEXT');
      } else {
        dxf.addRect(wc.x - panel.height, wc.y, panel.height, panel.width, 'GLASS_PANELS');
        dxf.addText(panel.id, wc.x - panel.height / 2, wc.y + panel.width / 2, 50, 'TEXT');
      }
    }

    if (segment.angle === 0) {
      dxf.addText(
        `${Math.round(segment.length)} mm`,
        segment.originX + segment.length / 2,
        yOffset - 80,
        40,
        'DIMENSIONS',
      );
    } else {
      dxf.addText(
        `${Math.round(segment.length)} mm`,
        segment.originX + 80,
        yOffset + segment.originY + segment.length / 2,
        40,
        'DIMENSIONS',
      );
    }
  }
}

export function exportDxf(railings: Railing[], params: LayoutParams) {
  const dxf = new DxfWriter();

  dxf.addLayer('GLASS_PANELS', 1);
  dxf.addLayer('DIMENSIONS', 3);
  dxf.addLayer('BASE_PROFILE', 5);
  dxf.addLayer('TEXT', 7);

  let yOffset = 0;
  for (const railing of railings) {
    writeRailing(dxf, railing, yOffset);
    // Space railings vertically
    yOffset += railing.params.systemHeight + 500;
  }

  const content = dxf.toString();
  const blob = new Blob([content], { type: 'application/dxf' });
  const safeName = params.projectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadBlob(blob, `${safeName}.dxf`);
}
