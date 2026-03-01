import type { BomResult, LayoutParams } from '../types';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportBomCsv(bom: BomResult, params: LayoutParams) {
  const lines: string[] = [];
  lines.push('Type,Panel ID(s),Description,Width (mm),Height (mm),Thickness (mm),Length (mm),Qty');

  for (const item of bom.glassItems) {
    lines.push(`Glass,"${item.panelId}",,${item.width},${item.height},${item.thickness},,${item.qty}`);
  }
  for (const item of bom.profileItems) {
    lines.push(`Profile,,"${item.description}",,,,${item.length},${item.qty}`);
  }
  for (const item of bom.accessoryItems) {
    lines.push(`Accessory,,"${item.description}",,,,,${item.qty}`);
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const safeName = params.projectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadBlob(blob, `${safeName}-BOM.csv`);
}
