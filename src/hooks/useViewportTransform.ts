import { useState, useCallback, useRef } from 'react';

export interface ViewportTransform {
  x: number;
  y: number;
  scale: number;
}

export function useViewportTransform() {
  const [transform, setTransform] = useState<ViewportTransform>({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

    setTransform(prev => {
      const newScale = Math.max(0.05, Math.min(20, prev.scale * zoomFactor));
      // Zoom toward cursor
      const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
      const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);
      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 0 || e.button === 1) {
      isPanning.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const fitToView = useCallback(
    (contentWidth: number, contentHeight: number, viewportWidth: number, viewportHeight: number) => {
      const padFactor = 0.80;
      const scaleX = (viewportWidth * padFactor) / contentWidth;
      const scaleY = (viewportHeight * padFactor) / contentHeight;
      const scale = Math.min(scaleX, scaleY);
      const x = (viewportWidth - contentWidth * scale) / 2;
      const y = (viewportHeight - contentHeight * scale) / 2;
      setTransform({ x, y, scale });
    },
    [],
  );

  const zoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.min(20, prev.scale * 1.25) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.max(0.05, prev.scale * 0.8) }));
  }, []);

  return { transform, onWheel, onPointerDown, onPointerMove, onPointerUp, fitToView, zoomIn, zoomOut, setTransform };
}
