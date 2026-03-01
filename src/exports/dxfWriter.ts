/**
 * Minimal DXF R12 ASCII writer.
 * Produces files compatible with AutoCAD and all major DXF viewers.
 * Units: millimeters (INSUNITS = 4).
 */

interface LayerDef {
  name: string;
  color: number; // AutoCAD color index (ACI)
}

export class DxfWriter {
  private entities: string[] = [];
  private layers: LayerDef[] = [];

  addLayer(name: string, color: number) {
    this.layers.push({ name, color });
  }

  addLine(x1: number, y1: number, x2: number, y2: number, layer: string) {
    this.entities.push(
      '0', 'LINE',
      '8', layer,
      '10', x1.toFixed(2),
      '20', y1.toFixed(2),
      '30', '0',
      '11', x2.toFixed(2),
      '21', y2.toFixed(2),
      '31', '0',
    );
  }

  addRect(x: number, y: number, width: number, height: number, layer: string) {
    this.addLine(x, y, x + width, y, layer);
    this.addLine(x + width, y, x + width, y + height, layer);
    this.addLine(x + width, y + height, x, y + height, layer);
    this.addLine(x, y + height, x, y, layer);
  }

  addText(text: string, x: number, y: number, height: number, layer: string) {
    this.entities.push(
      '0', 'TEXT',
      '8', layer,
      '10', x.toFixed(2),
      '20', y.toFixed(2),
      '30', '0',
      '40', height.toFixed(2),
      '1', text,
      '72', '1', // horizontal center
      '11', x.toFixed(2),
      '21', y.toFixed(2),
      '31', '0',
    );
  }

  toString(): string {
    const lines: string[] = [];

    // HEADER section
    lines.push('0', 'SECTION', '2', 'HEADER');
    lines.push('9', '$INSUNITS', '70', '4'); // millimeters
    lines.push('9', '$ACADVER', '1', 'AC1009'); // R12
    lines.push('0', 'ENDSEC');

    // TABLES section
    lines.push('0', 'SECTION', '2', 'TABLES');

    // LAYER table
    lines.push('0', 'TABLE', '2', 'LAYER');
    lines.push('70', String(this.layers.length));
    for (const layer of this.layers) {
      lines.push(
        '0', 'LAYER',
        '2', layer.name,
        '70', '0',
        '62', String(layer.color),
        '6', 'CONTINUOUS',
      );
    }
    lines.push('0', 'ENDTAB');
    lines.push('0', 'ENDSEC');

    // ENTITIES section
    lines.push('0', 'SECTION', '2', 'ENTITIES');
    lines.push(...this.entities);
    lines.push('0', 'ENDSEC');

    // EOF
    lines.push('0', 'EOF');

    return lines.join('\n');
  }
}
