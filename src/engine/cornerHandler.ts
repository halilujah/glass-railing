export interface CornerGeometry {
  effectiveA: number;
  effectiveB: number;
  cornerVertex: { x: number; y: number };
  segmentAOrigin: { x: number; y: number };
  segmentBOrigin: { x: number; y: number };
  segmentBAngle: number;
}

export function computeCornerGeometry(
  segmentALength: number,
  segmentBLength: number,
  edgeClearance: number,
  cornerGap: number,
): CornerGeometry {
  const effectiveA = segmentALength - edgeClearance - cornerGap / 2;
  const effectiveB = segmentBLength - edgeClearance - cornerGap / 2;

  return {
    effectiveA,
    effectiveB,
    cornerVertex: { x: segmentALength, y: 0 },
    segmentAOrigin: { x: 0, y: 0 },
    segmentBOrigin: { x: segmentALength, y: 0 },
    segmentBAngle: 90,
  };
}
