import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { useViewportTransform } from '../../hooks/useViewportTransform';
import { PanelRenderer } from './PanelRenderer';
import { PanelLabels } from './PanelLabels';
import { SegmentLabels } from './SegmentLabels';
import { BaseProfileLine } from './BaseProfileLine';
import { DimensionLines } from './DimensionLines';
import { CornerAnnotation } from './CornerAnnotation';
import '../../styles/drawing-viewport.css';

// 1mm = 0.15 SVG units — keeps coordinates manageable
const MM_SCALE = 0.15;

export function DrawingViewport() {
  const layout = useStore(s => s.layout);
  const params = useStore(s => s.params);
  const activeStep = useStore(s => s.activeStep);
  const setSelectedPanelId = useStore(s => s.setSelectedPanelId);
  const containerRef = useRef<HTMLDivElement>(null);
  const { transform, onWheel, onPointerDown, onPointerMove, onPointerUp, fitToView, zoomIn, zoomOut } =
    useViewportTransform();

  const doFit = useCallback(() => {
    if (!containerRef.current || !layout.isValid) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Compute bounding box of layout
    let maxX = 0;
    let maxY = params.systemHeight * MM_SCALE;
    for (const seg of layout.segments) {
      if (seg.angle === 0) {
        maxX = Math.max(maxX, (seg.originX + seg.length) * MM_SCALE);
      } else {
        // Segment B goes upward (negative Y in SVG terms)
        maxY = Math.max(maxY, (seg.originX) * MM_SCALE); // Not ideal but safe estimate
        maxX = Math.max(maxX, (seg.originX + params.systemHeight) * MM_SCALE);
      }
    }
    // Add margins for dimension lines
    const margin = 80;
    fitToView(maxX + margin, maxY + margin + 60, rect.width, rect.height);
  }, [layout, params, fitToView]);

  useEffect(() => {
    doFit();
  }, [layout.segments.length, params.layoutType]);

  // Re-fit when step changes (container width changes when panel hides/shows)
  useEffect(() => {
    const timer = setTimeout(doFit, 50);
    return () => clearTimeout(timer);
  }, [activeStep]);

  // Initial fit
  useEffect(() => {
    const timer = setTimeout(doFit, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="drawing-viewport"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={() => setSelectedPanelId(null)}
    >
      {layout.isValid && layout.segments.length > 0 ? (
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {layout.segments.map(segment => {
              // For segment B in L-shape, rotate 90° counterclockwise
              const tx = segment.originX * MM_SCALE;
              const ty = segment.originY * MM_SCALE;
              const segTransform =
                segment.angle === 0
                  ? `translate(${tx}, ${ty})`
                  : `translate(${tx}, ${ty}) rotate(-90)`;

              return (
                <g key={segment.index} transform={segTransform}>
                  <BaseProfileLine segment={segment} params={params} scale={MM_SCALE} />
                  <PanelRenderer segment={segment} params={params} scale={MM_SCALE} />
                  <DimensionLines segment={segment} params={params} scale={MM_SCALE} />
                  <PanelLabels segment={segment} scale={MM_SCALE} />
                  <SegmentLabels segment={segment} scale={MM_SCALE} />
                </g>
              );
            })}

            {params.layoutType === 'l-shape' && layout.segments.length > 1 && (
              <CornerAnnotation
                params={params}
                scale={MM_SCALE}
                cornerX={layout.segments[1].originX}
                cornerY={layout.segments[1].originY}
              />
            )}
          </g>
        </svg>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
          Fix validation errors to see drawing preview
        </div>
      )}

      <div className="drawing-info">
        Layout: <strong>{params.layoutType === 'straight' ? 'Straight Run' : 'L-Shape'}</strong>
        {' | '}Panels: <strong>{layout.totalPanelCount}</strong>
        {layout.isValid && layout.segments[0]?.panels[0] && (
          <>{' | '}Width: <strong>{Math.round(layout.segments[0].panels[0].width)} mm</strong></>
        )}
      </div>

      <div className="zoom-controls no-print">
        <button className="zoom-btn" onClick={zoomIn} title="Zoom in">+</button>
        <button className="zoom-btn" onClick={zoomOut} title="Zoom out">−</button>
        <button className="zoom-btn" onClick={doFit} title="Fit to view" style={{ fontSize: '12px' }}>Fit</button>
      </div>
    </div>
  );
}
