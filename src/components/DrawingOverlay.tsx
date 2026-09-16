import React, { useState, useRef, useEffect } from 'react';
import { DrawingElement, DrawingToolType, DrawingPoint } from '../types';
import {
  RefreshCw,
  Minus,
  Spline,
  MoveUpRight,
  ArrowUpRight,
  Trash2,
  X,
} from 'lucide-react';

interface DrawingOverlayProps {
  elements?: DrawingElement[];
  arrows?: DrawingElement[];
  onAddElement?: (element: DrawingElement) => void;
  onAddArrow?: (arrow: DrawingElement) => void;
  onUpdateElement?: (element: DrawingElement) => void;
  onRemoveElement?: (id: string) => void;
  onRemoveArrow?: (id: string) => void;
  isDrawingMode: boolean;
  activeTool?: DrawingToolType;
  activeType?: 'pass' | 'run' | 'dribble' | 'press';
  activeColor?: string;
  strokeWidth?: number;
  isHighlighted?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const DrawingOverlayComponent: React.FC<DrawingOverlayProps> = ({
  elements,
  arrows,
  onAddElement,
  onAddArrow,
  onUpdateElement,
  onRemoveElement,
  onRemoveArrow,
  isDrawingMode,
  activeTool,
  activeType,
  activeColor = '#38BDF8',
  strokeWidth = 2.0,
  isHighlighted = false,
  orientation = 'horizontal',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG coordinate dimensions based on pitch orientation
  const boundsX = orientation === 'horizontal' ? 1000 : 700;
  const boundsY = orientation === 'horizontal' ? 700 : 1000;

  // Percentage (0-100) <-> SVG units
  const pctToSvgX = (pct: number) => (pct / 100) * boundsX;
  const pctToSvgY = (pct: number) => (pct / 100) * boundsY;
  const svgToPctX = (svgX: number) => (svgX / boundsX) * 100;
  const svgToPctY = (svgY: number) => (svgY / boundsY) * 100;

  // Unified elements list
  const activeElements = elements || arrows || [];
  const handleAdd = onAddElement || onAddArrow;
  const handleRemove = onRemoveElement || onRemoveArrow;

  // Resolve current effective tool
  const currentTool: DrawingToolType = activeTool
    ? activeTool
    : activeType === 'pass'
    ? 'line'
    : activeType === 'dribble'
    ? 'arrow_curved'
    : activeType === 'press'
    ? 'rectangle'
    : 'arrow_solid';

  const isPointerHand = currentTool === 'hand' || currentTool === 'select';

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<DrawingPoint | null>(null);
  const [currentPoint, setCurrentPoint] = useState<DrawingPoint | null>(null);
  const [dragPoints, setDragPoints] = useState<DrawingPoint[]>([]);

  // Selected element state for interactive control handles (Bend, Start, End)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | 'control' | null>(null);
  const [handlePointerId, setHandlePointerId] = useState<number | null>(null);

  // Clear selection if tool is switched to eraser
  useEffect(() => {
    if (currentTool === 'eraser') {
      setSelectedId(null);
    }
  }, [currentTool]);

  // Smooth, natural Bezier curve control point calculation
  const calculateCurvePoint = (
    start: DrawingPoint,
    end: DrawingPoint,
    pts: DrawingPoint[]
  ): { controlX: number; controlY: number } => {
    const Ax = start.x;
    const Ay = start.y;
    const Bx = end.x;
    const By = end.y;
    const dx = Bx - Ax;
    const dy = By - Ay;
    const len = Math.hypot(dx, dy);

    if (len < 0.2) {
      return { controlX: (Ax + Bx) / 2, controlY: (Ay + By) / 2 };
    }

    const mx = (Ax + Bx) / 2;
    const my = (Ay + By) / 2;

    // Unit normal vector perpendicular to chord AB
    const nx = -dy / len;
    const ny = dx / len;

    let maxPerpDist = 0;
    if (pts && pts.length > 1) {
      for (const p of pts) {
        // Signed perpendicular distance from line AB: (dx*(p.y - Ay) - dy*(p.x - Ax)) / len
        const dist = (dx * (p.y - Ay) - dy * (p.x - Ax)) / len;
        if (Math.abs(dist) > Math.abs(maxPerpDist)) {
          maxPerpDist = dist;
        }
      }
    }

    // If user made an arced drag gesture, follow their arc smoothly
    if (Math.abs(maxPerpDist) > 0.4) {
      // Quadratic Bezier peak height is half the control point offset from chord
      const offset = Math.max(-30, Math.min(30, maxPerpDist * 1.6));
      const cx = mx + nx * offset;
      const cy = my + ny * offset;
      return {
        controlX: Math.max(0, Math.min(100, cx)),
        controlY: Math.max(0, Math.min(100, cy)),
      };
    }

    // Default natural gentle arc (bows slightly outward)
    const defaultOffset = Math.min(9, Math.max(3.5, len * 0.22));
    const cx = mx + nx * defaultOffset;
    const cy = my + ny * defaultOffset;
    return {
      controlX: Math.max(0, Math.min(100, cx)),
      controlY: Math.max(0, Math.min(100, cy)),
    };
  };

  // Convert client pointer coordinates to percentage (0 to 100)
  const getCoordinates = (e: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>): DrawingPoint | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  // Helper for Eraser tool
  const checkEraserHit = (pt: DrawingPoint) => {
    if (!handleRemove) return;
    activeElements.forEach((elem) => {
      const minX = Math.min(elem.startX, elem.endX) - 5;
      const maxX = Math.max(elem.startX, elem.endX) + 5;
      const minY = Math.min(elem.startY, elem.endY) - 5;
      const maxY = Math.max(elem.startY, elem.endY) + 5;

      if (pt.x >= minX && pt.x <= maxX && pt.y >= minY && pt.y <= maxY) {
        handleRemove(elem.id);
        if (selectedId === elem.id) setSelectedId(null);
      }
    });
  };

  // Handle pointer down on background SVG
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingMode) return;

    // If clicking on an active handle or mini toolbar, do not initiate drawing
    const target = e.target as HTMLElement;
    if (target.closest('.drawing-handle') || target.closest('.drawing-hud')) return;

    // If in Hand/Select mode, click outside deselects
    if (isPointerHand) {
      setSelectedId(null);
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    const pt = getCoordinates(e);
    if (!pt) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDrawing(true);
    setStartPoint(pt);
    setCurrentPoint(pt);
    setDragPoints([pt]);
    setSelectedId(null);

    if (currentTool === 'eraser') {
      checkEraserHit(pt);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingMode) return;

    if ((isDrawing || draggingHandle) && e.cancelable) {
      e.preventDefault();
    }

    // 1. Handle dragging an existing element handle (Start, End, or Curve Bend point)
    if (draggingHandle && selectedId && onUpdateElement) {
      const pt = getCoordinates(e);
      if (!pt) return;
      const selectedElem = activeElements.find((el) => el.id === selectedId);
      if (!selectedElem) return;

      if (draggingHandle === 'start') {
        onUpdateElement({
          ...selectedElem,
          startX: pt.x,
          startY: pt.y,
        });
      } else if (draggingHandle === 'end') {
        onUpdateElement({
          ...selectedElem,
          endX: pt.x,
          endY: pt.y,
        });
      } else if (draggingHandle === 'control') {
        onUpdateElement({
          ...selectedElem,
          controlX: pt.x,
          controlY: pt.y,
        });
      }
      return;
    }

    // 2. Handle active drawing
    if (!isDrawing || !startPoint) return;
    const pt = getCoordinates(e);
    if (!pt) return;

    setCurrentPoint(pt);

    if (currentTool === 'eraser') {
      checkEraserHit(pt);
      return;
    }

    setDragPoints((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return [pt];
      const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
      if (dist > 0.2) {
        return [...prev, pt];
      }
      return prev;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    // Release active handle drag
    if (draggingHandle) {
      setDraggingHandle(null);
      setHandlePointerId(null);
      return;
    }

    if (!isDrawingMode || !isDrawing || !startPoint || !currentPoint) {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
      setDragPoints([]);
      return;
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (currentTool === 'eraser') {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
      setDragPoints([]);
      return;
    }

    const dist = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);

    // Save deliberate drawing strokes
    if (currentTool === 'pen') {
      if (dragPoints.length >= 2) {
        const newId = `draw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newElem: DrawingElement = {
          id: newId,
          tool: 'pen',
          startX: dragPoints[0].x,
          startY: dragPoints[0].y,
          endX: dragPoints[dragPoints.length - 1].x,
          endY: dragPoints[dragPoints.length - 1].y,
          points: dragPoints,
          color: activeColor,
          strokeWidth,
          isHighlighted,
        };
        if (handleAdd) {
          handleAdd(newElem);
          // Keep pen drawing clean and simple without auto-selecting or showing points
        }
      }
    } else if (dist >= 1.0) {
      const finalStartX = startPoint.x;
      const finalStartY = startPoint.y;
      const finalEndX = currentPoint.x;
      const finalEndY = currentPoint.y;

      const isCurved = currentTool === 'arrow_curved' || currentTool === 'arrow_curved_dashed';
      const isDashed =
        currentTool === 'arrow_dashed' ||
        currentTool === 'arrow_curved_dashed' ||
        currentTool === 'line_dashed';

      let controlX: number | undefined;
      let controlY: number | undefined;

      if (isCurved) {
        const ctrl = calculateCurvePoint(
          { x: finalStartX, y: finalStartY },
          { x: finalEndX, y: finalEndY },
          dragPoints
        );
        controlX = ctrl.controlX;
        controlY = ctrl.controlY;
      }

      const newId = `draw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newElem: DrawingElement = {
        id: newId,
        tool: isCurved ? (isDashed ? 'arrow_curved_dashed' : 'arrow_curved') : currentTool,
        startX: finalStartX,
        startY: finalStartY,
        endX: finalEndX,
        endY: finalEndY,
        controlX,
        controlY,
        color: activeColor,
        strokeWidth,
        isDashed,
        isHighlighted,
        type: isDashed ? 'run' : 'pass',
      };

      if (handleAdd) {
        handleAdd(newElem);
      }
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setDragPoints([]);
  };

  // Quick Action Handlers for Selected Elements
  const flipCurve = (elem: DrawingElement) => {
    if (!onUpdateElement) return;
    const Ax = elem.startX;
    const Ay = elem.startY;
    const Bx = elem.endX;
    const By = elem.endY;
    const mx = (Ax + Bx) / 2;
    const my = (Ay + By) / 2;
    const curCx = elem.controlX !== undefined ? elem.controlX : mx;
    const curCy = elem.controlY !== undefined ? elem.controlY : my;

    // Flip perpendicular offset across chord AB
    const vx = curCx - mx;
    const vy = curCy - my;

    const newCx = Math.max(0, Math.min(100, mx - vx));
    const newCy = Math.max(0, Math.min(100, my - vy));

    onUpdateElement({
      ...elem,
      controlX: newCx,
      controlY: newCy,
    });
  };

  const toggleCurved = (elem: DrawingElement) => {
    if (!onUpdateElement) return;
    const isCurved = elem.tool === 'arrow_curved' || elem.tool === 'arrow_curved_dashed';
    const isDashed =
      elem.isDashed ||
      elem.tool === 'arrow_dashed' ||
      elem.tool === 'arrow_curved_dashed' ||
      elem.tool === 'line_dashed';

    if (isCurved) {
      onUpdateElement({
        ...elem,
        tool: isDashed ? 'arrow_dashed' : 'arrow_solid',
        controlX: undefined,
        controlY: undefined,
      });
    } else {
      const defaultCtrl = calculateCurvePoint(
        { x: elem.startX, y: elem.startY },
        { x: elem.endX, y: elem.endY },
        []
      );
      onUpdateElement({
        ...elem,
        tool: isDashed ? 'arrow_curved_dashed' : 'arrow_curved',
        controlX: defaultCtrl.controlX,
        controlY: defaultCtrl.controlY,
      });
    }
  };

  const toggleDashed = (elem: DrawingElement) => {
    if (!onUpdateElement) return;
    const currentlyDashed =
      elem.isDashed ||
      elem.tool === 'arrow_dashed' ||
      elem.tool === 'arrow_curved_dashed' ||
      elem.tool === 'line_dashed';
    const isCurved = elem.tool === 'arrow_curved' || elem.tool === 'arrow_curved_dashed';
    const isLine = elem.tool === 'line' || elem.tool === 'line_dashed';

    let newTool = elem.tool;
    if (isCurved) {
      newTool = currentlyDashed ? 'arrow_curved' : 'arrow_curved_dashed';
    } else if (isLine) {
      newTool = currentlyDashed ? 'line' : 'line_dashed';
    } else {
      newTool = currentlyDashed ? 'arrow_solid' : 'arrow_dashed';
    }

    onUpdateElement({
      ...elem,
      tool: newTool,
      isDashed: !currentlyDashed,
      type: !currentlyDashed ? 'run' : 'pass',
    });
  };

  // Helper for freehand pen SVG string with smooth interpolation
  const getPenPathSvg = (pts: DrawingPoint[]) => {
    if (!pts || pts.length === 0) return '';
    const firstX = pctToSvgX(pts[0].x);
    const firstY = pctToSvgY(pts[0].y);
    if (pts.length === 1) return `M ${firstX} ${firstY} L ${firstX + 0.1} ${firstY + 0.1}`;
    if (pts.length === 2) {
      return `M ${firstX} ${firstY} L ${pctToSvgX(pts[1].x)} ${pctToSvgY(pts[1].y)}`;
    }
    let d = `M ${firstX} ${firstY}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const pCurrent = pts[i];
      const pNext = pts[i + 1];
      const midX = (pctToSvgX(pCurrent.x) + pctToSvgX(pNext.x)) / 2;
      const midY = (pctToSvgY(pCurrent.y) + pctToSvgY(pNext.y)) / 2;
      d += ` Q ${pctToSvgX(pCurrent.x)} ${pctToSvgY(pCurrent.y)}, ${midX} ${midY}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${pctToSvgX(last.x)} ${pctToSvgY(last.y)}`;
    return d;
  };

  // Clean hex id for SVG marker
  const cleanColorId = (col: string) => (col || '#38BDF8').replace(/[^a-zA-Z0-9]/g, '');

  const allColors = Array.from(new Set([activeColor, ...activeElements.map((e) => e.color)]));

  const selectedElem = activeElements.find((e) => e.id === selectedId);

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none select-none ${isDrawingMode && !isPointerHand ? 'touch-none' : ''}`}>
      <svg
        ref={svgRef}
        className={`absolute inset-0 w-full h-full select-none ${
          isDrawingMode && !isPointerHand
            ? 'z-40 pointer-events-auto touch-none ' +
              (currentTool === 'eraser'
                ? 'cursor-pointer'
                : 'cursor-crosshair')
            : 'z-20 pointer-events-none cursor-default'
        }`}
        viewBox={`0 0 ${boundsX} ${boundsY}`}
        preserveAspectRatio="none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          {/* Sharp, proportioned arrowhead markers for each color */}
          {allColors.map((color) => {
            const cid = cleanColorId(color);
            return (
              <React.Fragment key={cid}>
                <marker
                  id={`marker-arrow-${cid}`}
                  viewBox="0 0 12 12"
                  refX="9"
                  refY="6"
                  markerWidth="12"
                  markerHeight="12"
                  markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse"
                >
                  <path d="M 1.5 2.2 L 10.5 6 L 1.5 9.8 L 3.8 6 z" fill={color} />
                </marker>
              </React.Fragment>
            );
          })}
        </defs>

        {/* Saved Drawing Elements */}
        {activeElements.map((elem) => {
          const toolType = elem.tool || (elem.type === 'run' ? 'arrow_dashed' : 'arrow_solid');
          const cid = cleanColorId(elem.color);

          const sX = pctToSvgX(elem.startX);
          const sY = pctToSvgY(elem.startY);
          const eX = pctToSvgX(elem.endX);
          const eY = pctToSvgY(elem.endY);
          const cX = elem.controlX !== undefined ? pctToSvgX(elem.controlX) : (sX + eX) / 2;
          const cY = elem.controlY !== undefined ? pctToSvgY(elem.controlY) : (sY + eY) / 2;

          const strokeVal = Math.max(1.5, Math.min(4.5, (elem.strokeWidth || 2.0) * 1.15));
          const isDash =
            elem.isDashed ||
            toolType === 'arrow_dashed' ||
            toolType === 'arrow_curved_dashed' ||
            toolType === 'line_dashed';
          const isHL = elem.isHighlighted;
          const isSelected = selectedId === elem.id;

          const isCurved = toolType === 'arrow_curved' || toolType === 'arrow_curved_dashed';

          return (
            <g
              key={elem.id}
              className={`group ${
                isDrawingMode && isPointerHand ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isDrawingMode) {
                  if (currentTool === 'eraser' && handleRemove) {
                    handleRemove(elem.id);
                  } else if (isPointerHand) {
                    if (elem.tool !== 'pen') {
                      setSelectedId(elem.id);
                    }
                  }
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (isPointerHand && isCurved) {
                  flipCurve(elem);
                }
              }}
            >
              {/* Invisible thicker hit-test stroke to make clicking/tapping effortless */}
              {toolType === 'arrow_solid' || toolType === 'arrow_dashed' || toolType === 'line' || toolType === 'line_dashed' ? (
                <line
                  x1={sX}
                  y1={sY}
                  x2={eX}
                  y2={eY}
                  stroke="transparent"
                  strokeWidth={Math.max(18, strokeVal * 6)}
                  strokeLinecap="round"
                />
              ) : null}

              {isCurved && (
                <path
                  d={`M ${sX} ${sY} Q ${cX} ${cY} ${eX} ${eY}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={Math.max(18, strokeVal * 6)}
                  strokeLinecap="round"
                />
              )}

              {/* Selection Highlight Glow behind stroke */}
              {isSelected && isPointerHand && elem.tool !== 'pen' && (
                <>
                  {isCurved ? (
                    <path
                      d={`M ${sX} ${sY} Q ${cX} ${cY} ${eX} ${eY}`}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={strokeVal + 6}
                      strokeOpacity="0.4"
                      strokeLinecap="round"
                    />
                  ) : toolType === 'arrow_solid' || toolType === 'arrow_dashed' || toolType === 'line' || toolType === 'line_dashed' ? (
                    <line
                      x1={sX}
                      y1={sY}
                      x2={eX}
                      y2={eY}
                      stroke="#F59E0B"
                      strokeWidth={strokeVal + 6}
                      strokeOpacity="0.4"
                      strokeLinecap="round"
                    />
                  ) : null}
                </>
              )}

              {/* Solid or Dashed Arrow */}
              {(toolType === 'arrow_solid' || toolType === 'arrow_dashed') && (
                <line
                  x1={sX}
                  y1={sY}
                  x2={eX}
                  y2={eY}
                  stroke={elem.color}
                  strokeWidth={strokeVal}
                  strokeDasharray={isDash ? '9 6' : undefined}
                  strokeLinecap="round"
                  markerEnd={`url(#marker-arrow-${cid})`}
                  className={`transition-colors group-hover:stroke-amber-300 ${isDash ? 'animate-dash-flow' : ''}`}
                />
              )}

              {/* Curved Arrow (Solid or Dashed) */}
              {(toolType === 'arrow_curved' || toolType === 'arrow_curved_dashed') && (
                <path
                  d={`M ${sX} ${sY} Q ${cX} ${cY} ${eX} ${eY}`}
                  fill="none"
                  stroke={elem.color}
                  strokeWidth={strokeVal}
                  strokeDasharray={isDash ? '9 6' : undefined}
                  strokeLinecap="round"
                  markerEnd={`url(#marker-arrow-${cid})`}
                  className={`transition-colors group-hover:stroke-amber-300 ${isDash ? 'animate-dash-flow' : ''}`}
                />
              )}

              {/* Straight Reference Line (Solid or Dashed) */}
              {(toolType === 'line' || toolType === 'line_dashed') && (
                <line
                  x1={sX}
                  y1={sY}
                  x2={eX}
                  y2={eY}
                  stroke={elem.color}
                  strokeWidth={strokeVal}
                  strokeDasharray={isDash ? '9 6' : undefined}
                  strokeLinecap="round"
                  className={`transition-colors group-hover:stroke-amber-300 ${isDash ? 'animate-dash-flow' : ''}`}
                />
              )}

              {/* Freehand Pen */}
              {toolType === 'pen' && elem.points && (
                <path
                  d={getPenPathSvg(elem.points)}
                  fill="none"
                  stroke={elem.color}
                  strokeWidth={strokeVal}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors group-hover:stroke-amber-300"
                />
              )}

              {/* Rectangle */}
              {toolType === 'rectangle' && (
                <rect
                  x={Math.min(sX, eX)}
                  y={Math.min(sY, eY)}
                  width={Math.abs(eX - sX)}
                  height={Math.abs(eY - sY)}
                  rx="6"
                  fill={isHL ? elem.color : 'none'}
                  fillOpacity={isHL ? 0.22 : 0}
                  stroke={elem.color}
                  strokeWidth={strokeVal}
                  strokeDasharray={isDash ? '7 5' : undefined}
                  className="transition-colors group-hover:stroke-amber-300 group-hover:fill-amber-400/25"
                />
              )}

              {/* Circle / Ellipse */}
              {toolType === 'circle' && (
                <ellipse
                  cx={(sX + eX) / 2}
                  cy={(sY + eY) / 2}
                  rx={Math.abs(eX - sX) / 2}
                  ry={Math.abs(eY - sY) / 2}
                  fill={isHL ? elem.color : 'none'}
                  fillOpacity={isHL ? 0.22 : 0}
                  stroke={elem.color}
                  strokeWidth={strokeVal}
                  strokeDasharray={isDash ? '7 5' : undefined}
                  className="transition-colors group-hover:stroke-amber-300 group-hover:fill-amber-400/25"
                />
              )}

              {/* Triangle */}
              {toolType === 'triangle' && (() => {
                const apexY = Math.abs(eY - sY) < 5 ? Math.min(sY, eY) : eY;
                const baseY = Math.abs(eY - sY) < 5 ? Math.max(sY, eY) : sY;
                return (
                  <polygon
                    points={`${(sX + eX) / 2},${apexY} ${sX},${baseY} ${eX},${baseY}`}
                    fill={isHL ? elem.color : 'none'}
                    fillOpacity={isHL ? 0.22 : 0}
                    stroke={elem.color}
                    strokeWidth={strokeVal}
                    strokeLinejoin="round"
                    strokeDasharray={isDash ? '7 5' : undefined}
                    className="transition-colors group-hover:stroke-amber-300 group-hover:fill-amber-400/25"
                  />
                );
              })()}

              {/* Hover deletion indicator badge for Eraser tool */}
              {isDrawingMode && currentTool === 'eraser' && (
                <circle
                  cx={(sX + eX) / 2}
                  cy={(sY + eY) / 2}
                  r="13"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                />
              )}
            </g>
          );
        })}

        {/* Interactive Control Handles for the currently SELECTED element */}
        {isDrawingMode && isPointerHand && selectedElem && selectedElem.tool !== 'pen' && (() => {
          const sX = pctToSvgX(selectedElem.startX);
          const sY = pctToSvgY(selectedElem.startY);
          const eX = pctToSvgX(selectedElem.endX);
          const eY = pctToSvgY(selectedElem.endY);
          const isCurved =
            selectedElem.tool === 'arrow_curved' ||
            selectedElem.tool === 'arrow_curved_dashed';
          const cX = selectedElem.controlX !== undefined ? pctToSvgX(selectedElem.controlX) : (sX + eX) / 2;
          const cY = selectedElem.controlY !== undefined ? pctToSvgY(selectedElem.controlY) : (sY + eY) / 2;

          return (
            <g className="drawing-handle pointer-events-auto touch-none select-none">
              {/* Curve tangent chord guide line */}
              {isCurved && (
                <line
                  x1={sX}
                  y1={sY}
                  x2={cX}
                  y2={cY}
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.6"
                />
              )}
              {isCurved && (
                <line
                  x1={eX}
                  y1={eY}
                  x2={cX}
                  y2={cY}
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.6"
                />
              )}

              {/* Start Handle (Green) */}
              <circle
                cx={sX}
                cy={sY}
                r="7"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="cursor-move drop-shadow-md hover:scale-125 transition-transform"
                onPointerDown={(e) => {
                  if (e.cancelable) e.preventDefault();
                  e.stopPropagation();
                  setDraggingHandle('start');
                  setHandlePointerId(e.pointerId);
                }}
              />

              {/* End Handle (Blue) */}
              <circle
                cx={eX}
                cy={eY}
                r="7"
                fill="#3B82F6"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="cursor-move drop-shadow-md hover:scale-125 transition-transform"
                onPointerDown={(e) => {
                  if (e.cancelable) e.preventDefault();
                  e.stopPropagation();
                  setDraggingHandle('end');
                  setHandlePointerId(e.pointerId);
                }}
              />

              {/* Prominent CURVE BEND HANDLE (Amber/Gold with distinct pulse) */}
              {isCurved && (
                <g
                  className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                  onPointerDown={(e) => {
                    if (e.cancelable) e.preventDefault();
                    e.stopPropagation();
                    setDraggingHandle('control');
                    setHandlePointerId(e.pointerId);
                  }}
                >
                  <circle
                    cx={cX}
                    cy={cY}
                    r="10"
                    fill="#F59E0B"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="drop-shadow-lg"
                  />
                  <circle
                    cx={cX}
                    cy={cY}
                    r="4"
                    fill="#FFFFFF"
                  />
                </g>
              )}
            </g>
          );
        })()}

        {/* Active Drag Preview While User is Actively Drawing */}
        {isDrawing && startPoint && currentPoint && (() => {
          const dragDist = Math.hypot(currentPoint.x - startPoint.x, currentPoint.y - startPoint.y);
          if (currentTool !== 'pen' && dragDist < 0.5) return null;
          if (currentTool === 'pen' && dragPoints.length < 2) return null;

          const sX = pctToSvgX(startPoint.x);
          const sY = pctToSvgY(startPoint.y);
          const eX = pctToSvgX(currentPoint.x);
          const eY = pctToSvgY(currentPoint.y);
          const strokeVal = Math.max(1.5, Math.min(4.5, (strokeWidth || 2.0) * 1.15));
          const cid = cleanColorId(activeColor);

          return (
            <g className="pointer-events-none opacity-90">
              {(currentTool === 'arrow_solid' || currentTool === 'arrow_dashed') && (
                <line
                  x1={sX}
                  y1={sY}
                  x2={eX}
                  y2={eY}
                  stroke={activeColor}
                  strokeWidth={strokeVal}
                  strokeDasharray={currentTool === 'arrow_dashed' ? '9 6' : undefined}
                  strokeLinecap="round"
                  markerEnd={`url(#marker-arrow-${cid})`}
                  className={currentTool === 'arrow_dashed' ? 'animate-dash-flow' : undefined}
                />
              )}

              {(currentTool === 'arrow_curved' || currentTool === 'arrow_curved_dashed') && (() => {
                const ctrl = calculateCurvePoint(startPoint, currentPoint, dragPoints);
                const cx = pctToSvgX(ctrl.controlX);
                const cy = pctToSvgY(ctrl.controlY);
                const isDash = currentTool === 'arrow_curved_dashed';
                return (
                  <path
                    d={`M ${sX} ${sY} Q ${cx} ${cy} ${eX} ${eY}`}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={strokeVal}
                    strokeDasharray={isDash ? '9 6' : undefined}
                    strokeLinecap="round"
                    markerEnd={`url(#marker-arrow-${cid})`}
                    className={isDash ? 'animate-dash-flow' : undefined}
                  />
                );
              })()}

              {(currentTool === 'line' || currentTool === 'line_dashed') && (
                <line
                  x1={sX}
                  y1={sY}
                  x2={eX}
                  y2={eY}
                  stroke={activeColor}
                  strokeWidth={strokeVal}
                  strokeDasharray={currentTool === 'line_dashed' ? '9 6' : undefined}
                  strokeLinecap="round"
                  className={currentTool === 'line_dashed' ? 'animate-dash-flow' : undefined}
                />
              )}

              {currentTool === 'pen' && dragPoints.length > 0 && (
                <path
                  d={getPenPathSvg(dragPoints)}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth={strokeVal}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {currentTool === 'rectangle' && (
                <rect
                  x={Math.min(sX, eX)}
                  y={Math.min(sY, eY)}
                  width={Math.abs(eX - sX)}
                  height={Math.abs(eY - sY)}
                  rx="6"
                  fill={isHighlighted ? activeColor : 'none'}
                  fillOpacity={isHighlighted ? 0.22 : 0}
                  stroke={activeColor}
                  strokeWidth={strokeVal}
                />
              )}

              {currentTool === 'circle' && (
                <ellipse
                  cx={(sX + eX) / 2}
                  cy={(sY + eY) / 2}
                  rx={Math.abs(eX - sX) / 2}
                  ry={Math.abs(eY - sY) / 2}
                  fill={isHighlighted ? activeColor : 'none'}
                  fillOpacity={isHighlighted ? 0.22 : 0}
                  stroke={activeColor}
                  strokeWidth={strokeVal}
                />
              )}

              {currentTool === 'triangle' && (() => {
                const apexY = Math.abs(eY - sY) < 5 ? Math.min(sY, eY) : eY;
                const baseY = Math.abs(eY - sY) < 5 ? Math.max(sY, eY) : sY;
                return (
                  <polygon
                    points={`${(sX + eX) / 2},${apexY} ${sX},${baseY} ${eX},${baseY}`}
                    fill={isHighlighted ? activeColor : 'none'}
                    fillOpacity={isHighlighted ? 0.22 : 0}
                    stroke={activeColor}
                    strokeWidth={strokeVal}
                  />
                );
              })()}
            </g>
          );
        })()}
      </svg>

      {/* Floating Tactical HUD for Selected Arrow / Line */}
      {isDrawingMode && isPointerHand && selectedElem && selectedElem.tool !== 'pen' && (() => {
        const isCurved =
          selectedElem.tool === 'arrow_curved' ||
          selectedElem.tool === 'arrow_curved_dashed';
        const isDashed =
          selectedElem.isDashed ||
          selectedElem.tool === 'arrow_dashed' ||
          selectedElem.tool === 'arrow_curved_dashed' ||
          selectedElem.tool === 'line_dashed';

        const midX = (selectedElem.startX + selectedElem.endX) / 2;
        const midY = (selectedElem.startY + selectedElem.endY) / 2;

        // Position HUD comfortably on screen without clipping
        const hudLeft = Math.max(12, Math.min(88, midX));
        const hudTop = Math.max(10, Math.min(86, midY > 50 ? midY - 12 : midY + 12));

        return (
          <div
            className="drawing-hud absolute z-50 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-150"
            style={{ left: `${hudLeft}%`, top: `${hudTop}%` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 bg-slate-950/95 text-white border border-amber-400/80 shadow-2xl rounded-xl p-1.5 backdrop-blur-md text-xs select-none">
              {/* Flip Curve Direction (if curved) */}
              {isCurved && (
                <button
                  type="button"
                  onClick={() => flipCurve(selectedElem)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 font-bold rounded-lg transition cursor-pointer"
                  title="Flip Curve Bend Direction (or double-click curve)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black">Flip Arc</span>
                </button>
              )}

              {/* Straight <-> Curve Toggle */}
              <button
                type="button"
                onClick={() => toggleCurved(selectedElem)}
                className={`p-1.5 rounded-lg transition active:scale-95 cursor-pointer ${
                  isCurved
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={isCurved ? 'Convert to Straight Line' : 'Convert to Curved Arc'}
              >
                {isCurved ? <Spline className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>

              {/* Solid <-> Dashed Toggle */}
              <button
                type="button"
                onClick={() => toggleDashed(selectedElem)}
                className={`p-1.5 rounded-lg transition active:scale-95 cursor-pointer ${
                  isDashed
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={isDashed ? 'Switch to Solid Line' : 'Switch to Dashed Line'}
              >
                {isDashed ? (
                  <MoveUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Quick Color Pickers */}
              <div className="flex items-center gap-1 px-1 border-l border-slate-700">
                {['#38BDF8', '#EF4444', '#F59E0B', '#10B981', '#FFFFFF'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      if (onUpdateElement) {
                        onUpdateElement({ ...selectedElem, color: col });
                      }
                    }}
                    className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                      selectedElem.color === col
                        ? 'scale-125 ring-2 ring-amber-400 border-white'
                        : 'border-slate-600 hover:scale-110 opacity-80'
                    }`}
                    style={{ backgroundColor: col }}
                    title={`Change color to ${col}`}
                  />
                ))}
              </div>

              {/* Delete Button */}
              {handleRemove && (
                <button
                  type="button"
                  onClick={() => {
                    handleRemove(selectedElem.id);
                    setSelectedId(null);
                  }}
                  className="p-1.5 bg-rose-500/20 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition cursor-pointer ml-0.5"
                  title="Delete this drawing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Dismiss HUD */}
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
                title="Deselect"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export const DrawingOverlay = React.memo(DrawingOverlayComponent);
