export interface DivisionResult {
  panelCount: number;
  panelWidth: number;  // equalized width in mm
}

export function dividePanels(
  effectiveLength: number,
  gap: number,
  minWidth: number,
  maxWidth: number,
): DivisionResult {
  if (effectiveLength <= 0) {
    return { panelCount: 0, panelWidth: 0 };
  }

  // N = floor((effectiveLength + gap) / (maxWidth + gap))
  let N = Math.floor((effectiveLength + gap) / (maxWidth + gap));
  if (N < 1) N = 1;

  const calcWidth = (n: number) => {
    const totalGaps = (n - 1) * gap;
    return (effectiveLength - totalGaps) / n;
  };

  let panelWidth = calcWidth(N);

  // If equalized width exceeds max, increment N
  while (panelWidth > maxWidth && N < 100) {
    N++;
    panelWidth = calcWidth(N);
  }

  // If equalized width is below min, decrement N
  while (panelWidth < minWidth && N > 1) {
    N--;
    panelWidth = calcWidth(N);
  }

  // Round to 0.1mm
  panelWidth = Math.round(panelWidth * 10) / 10;

  return { panelCount: N, panelWidth };
}
