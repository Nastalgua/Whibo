import { Draw, Point } from "@/types/drawing";
import { useEffect, useRef, useState } from "react";

export const useDraw = (onDraw: ({ ctx, prevPoint, currentPoint }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false);
  const prevPoint = useRef<Point | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onMouseDown = () => { console.log('stuff'); setMouseDown(true)};

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      if (!mouseDown) return;
      
      const currentPoint = computePointOnCanvas(e);
      const ctx = canvasRef.current?.getContext('2d');
      
      if (!currentPoint || !ctx) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
    }

    const computePointOnCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    }

    const upHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    }

    canvasRef.current?.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);

    const canvasRefCurrent = canvasRef.current;
    return () => {
      canvasRefCurrent?.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    }
  }, [onDraw]);

  return { canvasRef, onMouseDown };
}