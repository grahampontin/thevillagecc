import React, { useState, useEffect, useRef } from 'react';
import { getScoringArea } from '../../utils/cricketUtils';
function getBoundaryPoint(
  sx: number, sy: number,
  angle: number,
  cx: number, cy: number,
  rx: number, ry: number,
): { x: number; y: number } {
  const dirX = Math.sin(angle);
  const dirY = -Math.cos(angle);
  const dsx = sx - cx;
  const dsy = sy - cy;
  const a = dirX * dirX / (rx * rx) + dirY * dirY / (ry * ry);
  const b = 2 * (dsx * dirX / (rx * rx) + dsy * dirY / (ry * ry));
  const c = dsx * dsx / (rx * rx) + dsy * dsy / (ry * ry) - 1;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return { x: sx + dirX * rx, y: sy + dirY * ry };
  const t = (-b + Math.sqrt(disc)) / (2 * a);
  return { x: sx + t * dirX, y: sy + t * dirY };
}
export interface WagonWheelInputProps {
  batsmanName: string;
  amount: number;
  isLeftHanded?: boolean;
  bowlerView?: boolean;
  onToggleBowlerView?: () => void;
  onConfirm: (angle: number | null) => void;
}
export const WagonWheelInput: React.FC<WagonWheelInputProps> = ({
  batsmanName, amount, isLeftHanded, bowlerView, onToggleBowlerView, onConfirm,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [lineEnd, setLineEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    setSelectedAngle(null);
    setLineEnd(null);
  }, [bowlerView]);
  const stumpsX  = 150;
  const pitchTopY = 85;
  const stumpsY   = 155;
  const ellipseCx = 150;
  const ellipseCy = 120;
  const ellipseRx = 135;
  const ellipseRy = 110;
  const isBoundaryShot = amount >= 4;
  const originY = bowlerView ? pitchTopY : stumpsY;
  const computeAngleAndEnd = (
    clientX: number, clientY: number,
  ): { storedAngle: number; end: { x: number; y: number } } | null => {
    if (!svgRef.current) return null;
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return null;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const dx = svgPt.x - stumpsX;
    const dy = svgPt.y - originY;
    let rawAngle = Math.atan2(dy, dx) + Math.PI / 2;
    if (rawAngle < 0) rawAngle += 2 * Math.PI;
    if (rawAngle >= 2 * Math.PI) rawAngle -= 2 * Math.PI;
    const storedAngle = bowlerView
      ? (rawAngle + Math.PI) % (2 * Math.PI)
      : rawAngle;
    const end = isBoundaryShot
      ? getBoundaryPoint(stumpsX, originY, rawAngle, ellipseCx, ellipseCy, ellipseRx, ellipseRy)
      : svgPt;
    return { storedAngle, end };
  };
  const applyPoint = (clientX: number, clientY: number) => {
    const result = computeAngleAndEnd(clientX, clientY);
    if (!result) return;
    setSelectedAngle(result.storedAngle);
    setLineEnd(result.end);
  };
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => { setIsDragging(true); applyPoint(e.clientX, e.clientY); };
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => { if (isDragging) applyPoint(e.clientX, e.clientY); };
  const handleMouseUp   = (e: React.MouseEvent<SVGSVGElement>) => { if (isDragging) { applyPoint(e.clientX, e.clientY); setIsDragging(false); } };
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length > 0) applyPoint(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length > 0) applyPoint(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.changedTouches.length > 0) applyPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  };
  const ballColor = amount >= 6 ? '#f97316' : amount >= 4 ? '#3b82f6' : '#2196f3';
  const shotDescription = selectedAngle !== null ? (() => {
    const zoneAngle = isLeftHanded
      ? (2 * Math.PI - selectedAngle) % (2 * Math.PI)
      : selectedAngle;
    const area = getScoringArea(zoneAngle);
    if (amount >= 6) return `6 over ${area}`;
    if (amount >= 4) return `4 through ${area}`;
    if (amount === 1) return `Single to ${area}`;
    return `${amount} to ${area}`;
  })() : null;
  const baseOffX = isLeftHanded ? 80 : 220;
  const baseLegX = isLeftHanded ? 220 : 80;
  const offX = bowlerView ? baseLegX : baseOffX;
  const legX = bowlerView ? baseOffX : baseLegX;
  const labelY1 = originY - 4;
  const labelY2 = originY + 9;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-800">{batsmanName}</p>
        <p className="text-xs text-gray-500">
          {amount} {amount === 1 ? 'run' : 'runs'} — drag the field to mark the shot
        </p>
      </div>
      <button
        type="button"
        onClick={onToggleBowlerView}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-villageGreen hover:text-villageGreen transition-colors"
        aria-label="Toggle bowler/batter view"
      >
        <span className="material-symbols-outlined text-sm leading-none">swap_vert</span>
        {bowlerView ? 'Bowler view (tap to switch)' : 'Batter view (tap to switch)'}
      </button>
      <svg
        ref={svgRef}
        viewBox="0 0 300 260"
        className="w-full max-w-xs"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        data-testid="wagon-wheel-input"
      >
        <ellipse cx={ellipseCx} cy={ellipseCy} rx={ellipseRx} ry={ellipseRy} fill="#4a8f3f" />
        <ellipse cx={ellipseCx} cy={ellipseCy} rx={67} ry={55}
          fill="#3a7f2f" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
        <rect x={stumpsX - 6} y={pitchTopY} width={12} height={70} fill="#c8a96e" rx="2" />
        {!bowlerView ? (
          <>
            <text x={stumpsX} y={pitchTopY - 22} textAnchor="middle"
              fill="rgba(255,255,255,0.75)" fontSize="9">Bowler</text>
            <line x1={stumpsX} y1={pitchTopY - 18} x2={stumpsX} y2={pitchTopY - 6}
              stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
            <polygon
              points={`${stumpsX - 5},${pitchTopY - 6} ${stumpsX + 5},${pitchTopY - 6} ${stumpsX},${pitchTopY + 4}`}
              fill="rgba(255,255,255,0.75)" />
          </>
        ) : (
          <>
            <text x={stumpsX} y={stumpsY + 24} textAnchor="middle"
              fill="rgba(255,255,255,0.75)" fontSize="9">Bowler</text>
            <line x1={stumpsX} y1={stumpsY + 20} x2={stumpsX} y2={stumpsY + 8}
              stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
            <polygon
              points={`${stumpsX - 5},${stumpsY + 8} ${stumpsX + 5},${stumpsY + 8} ${stumpsX},${stumpsY - 2}`}
              fill="rgba(255,255,255,0.75)" />
          </>
        )}
        <text x={offX} y={labelY1} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Off</text>
        <text x={offX} y={labelY2} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Side</text>
        <text x={legX} y={labelY1} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Leg</text>
        <text x={legX} y={labelY2} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Side</text>
        {lineEnd && (
          <line
            x1={stumpsX} y1={originY}
            x2={lineEnd.x} y2={lineEnd.y}
            stroke={ballColor} strokeWidth={3} strokeLinecap="round"
          />
        )}
        <circle cx={stumpsX} cy={originY} r={5} fill="white" />
      </svg>
      {shotDescription && (
        <p className="text-sm font-semibold text-gray-800 text-center" data-testid="shot-description">
          {shotDescription}
        </p>
      )}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => onConfirm(null)}
          className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
        >
          Skip
        </button>
        <button
          onClick={() => onConfirm(selectedAngle)}
          disabled={selectedAngle === null}
          className="flex-1 py-2 bg-villageGreen text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Done
        </button>
      </div>
    </div>
  );
};
