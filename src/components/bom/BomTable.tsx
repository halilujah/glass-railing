import type { BomResult } from '../../types';
import { useStore } from '../../store/useStore';
import '../../styles/bom-table.css';

export function BomTable({ bomOverride }: { bomOverride?: BomResult } = {}) {
  const storeBom = useStore(s => s.activeStep === 1 ? s.totalBom : s.bom);
  const bom = bomOverride ?? storeBom;

  return (
    <div className="bom-container">
      {/* Glass Panels Table */}
      <div className="bom-section">
        <h3>Glass Panels</h3>
        <table className="bom-table">
          <thead>
            <tr>
              <th>Panel ID(s)</th>
              <th className="num">Width (mm)</th>
              <th className="num">Height (mm)</th>
              <th className="num">Thickness (mm)</th>
              <th className="num">Qty</th>
            </tr>
          </thead>
          <tbody>
            {bom.glassItems.map((item, i) => (
              <tr key={i}>
                <td>{item.panelId}</td>
                <td className="num">{item.width}</td>
                <td className="num">{item.height}</td>
                <td className="num">{item.thickness}</td>
                <td className="num">{item.qty}</td>
              </tr>
            ))}
            <tr className="bom-total-row">
              <td colSpan={4}>Total Glass Panels</td>
              <td className="num">{bom.glassItems.reduce((s, i) => s + i.qty, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Base Shoe Profiles Table */}
      <div className="bom-section">
        <h3>Base Shoe Profiles</h3>
        <table className="bom-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Length (mm)</th>
              <th className="num">Qty</th>
            </tr>
          </thead>
          <tbody>
            {bom.profileItems.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td className="num">{item.length}</td>
                <td className="num">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Accessories Table */}
      <div className="bom-section">
        <h3>Accessories</h3>
        <table className="bom-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Qty</th>
            </tr>
          </thead>
          <tbody>
            {bom.accessoryItems.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td className="num">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
