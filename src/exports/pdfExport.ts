import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { LayoutResult, BomResult, LayoutParams, Railing } from '../types';

function drawRailingLayout(
  doc: jsPDF,
  layout: LayoutResult,
  params: LayoutParams,
  drawArea: { x: number; y: number; w: number; h: number },
  label?: string,
) {
  // Compute bounding box
  let bboxW = 0;
  let bboxH = params.systemHeight;
  for (const seg of layout.segments) {
    if (seg.angle === 0) {
      bboxW = Math.max(bboxW, seg.originX + seg.length);
    } else {
      bboxH = Math.max(bboxH, seg.length + params.systemHeight);
      bboxW = Math.max(bboxW, seg.originX + params.systemHeight);
    }
  }
  if (bboxW === 0 || bboxH === 0) return;

  const scale = Math.min(drawArea.w / bboxW, drawArea.h / bboxH) * 0.85;
  const offsetX = drawArea.x + (drawArea.w - bboxW * scale) / 2;
  const offsetY = drawArea.y + 10;

  // Railing label
  if (label) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(label, drawArea.x, drawArea.y - 2);
  }

  doc.setLineWidth(0.3);
  doc.setDrawColor(100);

  for (const segment of layout.segments) {
    for (const panel of segment.panels) {
      let px: number, py: number, pw: number, ph: number;

      if (segment.angle === 0) {
        px = offsetX + (segment.originX + panel.x) * scale;
        py = offsetY;
        pw = panel.width * scale;
        ph = panel.height * scale;
      } else {
        px = offsetX + segment.originX * scale;
        py = offsetY + panel.x * scale;
        pw = panel.height * scale;
        ph = panel.width * scale;
      }

      doc.setFillColor(212, 232, 247);
      doc.rect(px, py, pw, ph, 'FD');

      doc.setFontSize(7);
      doc.setFont('courier', 'bold');
      doc.setTextColor(26, 82, 118);
      doc.text(panel.id, px + pw / 2, py + ph / 2, { align: 'center', baseline: 'middle' });

      doc.setFontSize(6);
      doc.setFont('courier', 'normal');
      doc.setTextColor(80);
      doc.text(`${Math.round(panel.width)}`, px + pw / 2, py - 2, { align: 'center' });
    }

    // Base profile line
    doc.setDrawColor(109, 76, 42);
    doc.setLineWidth(1);
    if (segment.angle === 0) {
      const bpY = offsetY + (params.systemHeight - 100) * scale;
      doc.line(
        offsetX + segment.originX * scale,
        bpY,
        offsetX + (segment.originX + segment.length) * scale,
        bpY,
      );
    }
    doc.setLineWidth(0.3);
    doc.setDrawColor(100);

    // Segment dimension
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50);
    if (segment.angle === 0) {
      const dimY = offsetY + params.systemHeight * scale + 8;
      doc.text(
        `Segment ${segment.label}: ${Math.round(segment.length)} mm`,
        offsetX + (segment.originX + segment.length / 2) * scale,
        dimY,
        { align: 'center' },
      );
    } else {
      doc.text(
        `Segment ${segment.label}: ${Math.round(segment.length)} mm`,
        offsetX + (segment.originX + params.systemHeight / 2) * scale,
        offsetY + (segment.length + 20) * scale,
        { align: 'center' },
      );
    }
  }

  // Height dimension
  doc.setFontSize(7);
  doc.setFont('courier', 'normal');
  doc.setTextColor(80);
  doc.text(
    `H: ${params.systemHeight} mm`,
    offsetX - 8,
    offsetY + (params.systemHeight * scale) / 2,
    { angle: 90, align: 'center' },
  );
}

export function exportPdf(railings: Railing[], bom: BomResult, params: LayoutParams) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // --- Project Header ---
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TK8200 Glass Railing \u2014 Shop Drawing', 20, 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const headerY = 32;
  doc.text(`Project: ${params.projectName}`, 20, headerY);
  doc.text(`Client: ${params.clientName}`, 20, headerY + 7);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, headerY + 14);
  doc.text(`Railings: ${railings.length}`, 20, headerY + 21);

  doc.setDrawColor(200);
  doc.line(20, headerY + 26, pageW - 20, headerY + 26);

  // --- 2D Drawings ---
  const drawStartY = headerY + 34;
  const totalDrawH = 120;
  const validRailings = railings.filter(r => r.layout.isValid);

  if (validRailings.length === 1) {
    drawRailingLayout(doc, validRailings[0].layout, validRailings[0].params, {
      x: 30, y: drawStartY, w: pageW - 60, h: totalDrawH,
    });
  } else if (validRailings.length > 1) {
    const perH = Math.floor(totalDrawH / validRailings.length) - 5;
    validRailings.forEach((r, i) => {
      drawRailingLayout(doc, r.layout, r.params, {
        x: 30,
        y: drawStartY + i * (perH + 8),
        w: pageW - 60,
        h: perH,
      }, r.name);
    });
  }

  // --- BOM Table ---
  const bomStartY = drawStartY + totalDrawH + 15;
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill of Materials', 20, bomStartY);

  autoTable(doc, {
    startY: bomStartY + 5,
    head: [['Panel ID(s)', 'Width (mm)', 'Height (mm)', 'Thickness (mm)', 'Qty']],
    body: bom.glassItems.map(item => [
      item.panelId,
      String(item.width),
      String(item.height),
      String(item.thickness),
      String(item.qty),
    ]),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [60, 60, 60], textColor: 255 },
    margin: { left: 20, right: pageW / 2 + 10 },
    tableWidth: pageW / 2 - 30,
  });

  autoTable(doc, {
    startY: bomStartY + 5,
    head: [['Item', 'Detail', 'Qty']],
    body: [
      ...bom.profileItems.map(item => [item.description, `${item.length} mm`, String(item.qty)]),
      ...bom.accessoryItems.map(item => [item.description, '\u2014', String(item.qty)]),
    ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [60, 60, 60], textColor: 255 },
    margin: { left: pageW / 2 + 10, right: 20 },
    tableWidth: pageW / 2 - 30,
  });

  // --- Footer ---
  const footerY = pageH - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120);
  doc.text('All dimensions in millimeters. Verify on site before fabrication.', 20, footerY);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - 20, footerY, { align: 'right' });

  const safeName = params.projectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}-ShopDrawing.pdf`);
}
