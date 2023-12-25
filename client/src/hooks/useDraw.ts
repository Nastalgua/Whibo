import { Draw, Point } from "@/types/drawing";
import { useEffect, useRef, useState } from "react";

type DrawingInfo = {
  prevScaledPoint : Point,
  scaledPoint : Point
}

export const useDraw = (onDraw: ({ ctx, prevPoint, currentPoint }: Draw, emit: boolean) => void) => {
  const [mouseDown, setMouseDown] = useState(false);
  
  const isRightPressed = useRef(false);
  const isLeftPressed = useRef(false);
  
  const drawings = useRef<DrawingInfo[]>([]);
  
  const color = "#000000";

  const scale = useRef(1);
  const currPoint = useRef<Point | null>(null);
  const prevPoint = useRef<Point | null>(null);
  const offset = useRef<Point>({x: 0, y:0});

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toScreen = (real: Point) : Point => {
    return { x: (real.x + offset.current.x) * scale.current, y: (real.y + offset.current.y) * scale.current }
  }

  const toReal = (screen: Point) : Point => {
    return { x: (screen.x / scale.current) - offset.current.x, y: (screen.y / scale.current) - offset.current.y }
  }

  const trueDimensions = () => {
    return { 
      width: canvasRef.current!.clientWidth / scale.current, 
      height: canvasRef.current!.clientHeight / scale.current
    }
  }

  const redrawCanvas = (canvasWidth: number = document.body.clientWidth, canvasHeight: number = document.body.clientHeight) => {
    canvasRef.current!.width = canvasWidth;
    canvasRef.current!.height = canvasHeight;

    const ctx = canvasRef.current?.getContext('2d');

    if (!ctx) { console.log("Missing canvas context..."); return; }

    drawings.current.forEach((line) => {
      const screenPrevScaledPoint = toScreen(line.prevScaledPoint);
      const screenCurrScaledPoint = toScreen(line.scaledPoint);
      onDraw({ ctx, prevPoint: screenPrevScaledPoint, currentPoint: screenCurrScaledPoint, color: color }, false);
    });
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // left mouse click
      isLeftPressed.current = true;
      isRightPressed.current = false;
    }

    if (e.button === 2) { // right mouse click
      isRightPressed.current = true;
      isLeftPressed.current = false;
    }
    if (!isRightPressed.current && !isLeftPressed.current) return;

    setMouseDown(true);
    currPoint.current = { x: e.pageX, y: e.pageY };
    prevPoint.current = { x: e.pageX, y: e.pageY };
  };

  /**
   * Add newly created lines to the history of lines.
   * @param line previous and current points of a line. 
   */
  const addNewLine = ({ currentPoint, prevPoint } : Draw) => {
    const scaledPoint : Point = toReal(currentPoint);
    const prevScaledPoint : Point = toReal(prevPoint!);

    drawings.current.push({ prevScaledPoint, scaledPoint });
  }

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      if (!mouseDown) return;
      
      currPoint.current = { x: e.pageX, y: e.pageY };

      const ctx = canvasRef.current?.getContext('2d');
      
      if (!currPoint || !ctx) return;

      if (isLeftPressed.current) {
        const line = { ctx, currentPoint: currPoint.current, prevPoint: prevPoint.current, color: color };
        addNewLine(line); // might want to be a stack
        onDraw(line, true);
      }

      if (isRightPressed.current) {
        offset.current = {
          x: offset.current.x + (currPoint.current.x - prevPoint.current!.x) / scale.current,
          y: offset.current.y + (currPoint.current.y - prevPoint.current!.y) / scale.current,
        }

        redrawCanvas(document.body.clientWidth, document.body.clientHeight);
      }

      prevPoint.current = currPoint.current;
    }

    const upHandler = () => {
      setMouseDown(false);
      isLeftPressed.current = false;
      isRightPressed.current = false;
      prevPoint.current = null;
    }

    const wheelHandler = (e: WheelEvent) => {
      const deltaY = e.deltaY;
      const scaleAmount = -deltaY / 500;
      scale.current = scale.current * (1 + scaleAmount);

      // zoom the page based on where the cursor is
      var distX = e.pageX / canvasRef.current!.clientWidth;
      var distY = e.pageY / canvasRef.current!.clientHeight;
      
      const tDim = trueDimensions();
      const unitsZoomedX = tDim.width * scaleAmount;
      const unitsZoomedY = tDim.height * scaleAmount;

      const unitsAddLeft = unitsZoomedX * distX;
      const unitsAddTop = unitsZoomedY * distY;
      
      offset.current = { x: offset.current.x - unitsAddLeft, y: offset.current.y - unitsAddTop };
      redrawCanvas();
    }

    canvasRef.current?.addEventListener('mousemove', moveHandler);
    canvasRef.current?.addEventListener('wheel', wheelHandler);
    window.addEventListener('mouseup', upHandler);

    const canvasRefCurrent = canvasRef.current;
    return () => {
      canvasRefCurrent?.removeEventListener('mousemove', moveHandler);
      canvasRefCurrent?.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('mouseup', upHandler);
    }
  }, [onDraw]);

  return { canvasRef, onMouseDown, redrawCanvas, addNewLine };
}