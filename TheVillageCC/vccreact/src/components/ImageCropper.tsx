import React, { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// ImageCropper
// Displays an image inside a square viewport and lets the user drag/zoom it.
// The entire viewport is the crop area (always 1:1). Clicking "Crop" draws the
// visible region to a canvas and calls onCrop with the resulting data URL.
// ---------------------------------------------------------------------------

const VIEWPORT = 300; // px – square crop window
const OUTPUT = 600;   // px – output canvas resolution

interface Props {
  src: string;
  onCrop: (dataUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<Props> = ({ src, onCrop, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Natural image dimensions (set once image loads)
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  // zoom is a multiplier on the natural image size
  const [zoom, setZoom] = useState(1);
  // offset of image top-left corner relative to the container (px)
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag state (kept in refs so pointer-move handler doesn't need re-registration)
  const dragRef = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null);

  // Compute the minimum zoom that ensures the image fills the whole viewport
  const minZoom = naturalSize
    ? Math.max(VIEWPORT / naturalSize.w, VIEWPORT / naturalSize.h)
    : 1;

  const maxZoom = minZoom * 4;

  // Clamp offset so the image always covers the viewport
  const clampOffset = useCallback(
    (ox: number, oy: number, z: number, ns: { w: number; h: number } | null) => {
      if (!ns) return { x: ox, y: oy };
      const displayW = ns.w * z;
      const displayH = ns.h * z;
      const minX = Math.min(0, VIEWPORT - displayW);
      const minY = Math.min(0, VIEWPORT - displayH);
      return {
        x: Math.max(minX, Math.min(0, ox)),
        y: Math.max(minY, Math.min(0, oy)),
      };
    },
    []
  );

  // When the image loads: determine initial zoom and centred offset
  const handleImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const ns = { w: img.naturalWidth, h: img.naturalHeight };
    setNaturalSize(ns);
    const z = Math.max(VIEWPORT / ns.w, VIEWPORT / ns.h);
    const ox = (VIEWPORT - ns.w * z) / 2;
    const oy = (VIEWPORT - ns.h * z) / 2;
    setZoom(z);
    setOffset(clampOffset(ox, oy, z, ns));
  }, [clampOffset]);

  // Pointer-down: start drag
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
  }, [offset]);

  // Pointer-move: pan image
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const newOffset = clampOffset(
      dragRef.current.startOffsetX + dx,
      dragRef.current.startOffsetY + dy,
      zoom,
      naturalSize
    );
    setOffset(newOffset);
  }, [zoom, naturalSize, clampOffset]);

  // Pointer-up: end drag
  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Zoom slider change: keep image centred on viewport centre
  const handleZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    if (!naturalSize) return;
    // Keep the viewport centre fixed in image coordinates
    const centreImgX = (-offset.x + VIEWPORT / 2) / zoom;
    const centreImgY = (-offset.y + VIEWPORT / 2) / zoom;
    const newOx = VIEWPORT / 2 - centreImgX * newZoom;
    const newOy = VIEWPORT / 2 - centreImgY * newZoom;
    setZoom(newZoom);
    setOffset(clampOffset(newOx, newOy, newZoom, naturalSize));
  }, [zoom, offset, naturalSize, clampOffset]);

  // Apply crop: draw visible region to a canvas and return data URL
  const handleCrop = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !naturalSize) return;

    // Source rectangle in natural-image coordinates
    const srcX = -offset.x / zoom;
    const srcY = -offset.y / zoom;
    const srcSize = VIEWPORT / zoom;

    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUTPUT, OUTPUT);
    onCrop(canvas.toDataURL('image/jpeg', 0.9));
  }, [offset, zoom, naturalSize, onCrop]);

  // Re-clamp offset whenever zoom changes (e.g., slider)
  useEffect(() => {
    setOffset(prev => clampOffset(prev.x, prev.y, zoom, naturalSize));
  }, [zoom, naturalSize, clampOffset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Crop photo">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-4 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Crop photo (1:1)</h2>

        {/* Viewport */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded border border-gray-300 touch-none select-none cursor-grab active:cursor-grabbing mx-auto"
          style={{ width: VIEWPORT, height: VIEWPORT }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          aria-label="Drag to reposition image"
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            onLoad={handleImageLoad}
            draggable={false}
            style={{
              position: 'absolute',
              width: naturalSize ? naturalSize.w * zoom : '100%',
              height: naturalSize ? naturalSize.h * zoom : 'auto',
              maxWidth: 'none',
              left: offset.x,
              top: offset.y,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-gray-500">zoom_out</span>
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={0.01}
            value={zoom}
            onChange={handleZoomChange}
            className="flex-1"
            aria-label="Zoom"
          />
          <span className="material-symbols-outlined text-[18px] text-gray-500">zoom_in</span>
        </div>

        {/* Hidden canvas used for rendering the crop */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className="px-4 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
