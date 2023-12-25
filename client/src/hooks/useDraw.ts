import ToolsContext from "@/contexts/tools/Context";
import { Draw, Point } from "@/types/drawing";
import { simplifyLine } from "@/utils/lineSmoothing";
import { useContext, useEffect, useRef, useState } from "react";

export type DrawingInfo = {
  prevScaledPoint : Point,
  scaledPoint : Point,
  originalPrevPoint : Point,
  originalCurrPoint : Point
}

export const useDraw = (
  onDraw: ({ ctx, prevPoint, currentPoint }: Draw, emit: boolean) => void,
  onUndraw: ({ ctx, prevPoint, currentPoint }: Draw, emit: boolean) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);
  
  const { selectedTool } = useContext(ToolsContext).ToolsState;

  const isRightPressed = useRef(false);
  const isLeftPressed = useRef(false);
  
  const drawings = useRef<DrawingInfo[]>([]);
  const tempDrawings = useRef<DrawingInfo[]>([]);
  
  const color = "#000000";

  const scale = useRef(1);
  const currPoint = useRef<Point | null>(null);
  const prevPoint = useRef<Point | null>(null);
  const offset = useRef<Point>({x: 0, y:0});

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const arePointsInCircle = (center : Point, point : Point, radius : number) => {
    const distance = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
    return distance <= radius;
  }

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
    tempDrawings.current = [];
    currPoint.current = { x: e.pageX, y: e.pageY };
    prevPoint.current = { x: e.pageX, y: e.pageY };
  }

  /**
   * Add newly created lines to the history of lines.
   * @param line previous and current points of a line. 
   */
  const addNewLine = ({ currentPoint, prevPoint } : Draw) => {
    const scaledPoint : Point = toReal(currentPoint);
    const prevScaledPoint : Point = toReal(prevPoint!);

    tempDrawings.current.push({ prevScaledPoint, scaledPoint, originalCurrPoint: currentPoint, originalPrevPoint: prevPoint! });
  }

  const removeLine = ({ currentPoint, prevPoint } : Draw) => {
    drawings.current = drawings.current.filter((drawInfo : DrawingInfo) => {
      return !arePointsInCircle(drawInfo.originalCurrPoint, currentPoint, 8) && !arePointsInCircle(drawInfo.originalPrevPoint, prevPoint!, 8);
    });
  }

  const performTool = ({ ctx, currentPoint, prevPoint, color } : Draw) => {
    const line: Draw = { ctx, currentPoint, prevPoint, color };
    if (selectedTool === 'pen') {
      addNewLine(line); // might want to be a stack
      onDraw(line, true);
    } else if (selectedTool === 'eraser') {
      removeLine(line);
      onUndraw(line, true);
    }
  }

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      if (!mouseDown) return;
      
      currPoint.current = { x: e.pageX, y: e.pageY };

      const ctx = canvasRef.current?.getContext('2d');
      
      if (!currPoint || !ctx) return;

      if (isLeftPressed.current) {
        performTool({ ctx, currentPoint: currPoint.current, prevPoint: prevPoint.current, color: color });
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

      // const points: Point[] = [];

      // tempDrawings.current.forEach((draw : DrawingInfo) => {
      //   points.push(draw.originalPrevPoint);
      //   points.push(draw.originalCurrPoint);
      // });

      // const smoothedLines = simplifyLine(tempDrawings.current, 1.0);
      // console.log(`Old point count: ${tempDrawings.current.length}`);
      // console.log(`New point count: ${smoothedLines.length}`);
      
      // add simplifiedTempDrawings to all drawings
      drawings.current = [...drawings.current, ...tempDrawings.current];

      tempDrawings.current = [];

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
  }, [onDraw, onUndraw]);

  return { canvasRef, onMouseDown, redrawCanvas, addNewLine, removeLine };
}