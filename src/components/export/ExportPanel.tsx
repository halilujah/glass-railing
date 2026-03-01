import { useStore } from '../../store/useStore';
import { BomTable } from '../bom/BomTable';
import { exportBomCsv } from '../../exports/csvExport';
import { exportPdf } from '../../exports/pdfExport';
import { exportDxf } from '../../exports/dxfExport';
import '../../styles/export-panel.css';

export function ExportPanel() {
  const railings = useStore(s => s.railings);
  const totalBom = useStore(s => s.totalBom);
  const params = useStore(s => s.params);

  return (
    <div className="export-panel">
      <div className="export-header">
        <h2>Export &amp; Downloads</h2>
        <p>
          Download shop drawings, BOM, and CAD files for fabrication.
          {railings.length > 1 && ` (${railings.length} railings)`}
        </p>
      </div>

      <div className="export-actions">
        <button
          className="export-btn"
          onClick={() => {
            // Export all railings into one PDF
            exportPdf(railings, totalBom, params);
          }}
        >
          <span className="export-btn-icon">PDF</span>
          <span className="export-btn-label">Shop Drawing</span>
          <span className="export-btn-desc">A3 landscape with BOM</span>
        </button>

        <button
          className="export-btn"
          onClick={() => {
            exportDxf(railings, params);
          }}
        >
          <span className="export-btn-icon">DXF</span>
          <span className="export-btn-label">CAD Export</span>
          <span className="export-btn-desc">AutoCAD R12 compatible</span>
        </button>

        <button
          className="export-btn"
          onClick={() => exportBomCsv(totalBom, params)}
        >
          <span className="export-btn-icon">CSV</span>
          <span className="export-btn-label">BOM Spreadsheet</span>
          <span className="export-btn-desc">Excel / Sheets compatible</span>
        </button>
      </div>

      <BomTable />
    </div>
  );
}
