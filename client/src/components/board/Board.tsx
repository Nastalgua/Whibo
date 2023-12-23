"use client";

import { useDraw } from "@/hooks/useDraw";
import { Draw, Point } from "@/types/drawing";
import React, { useEffect } from "react";

const Board: React.FunctionComponent = () => {
  const { canvasRef, onMouseDown, redrawCanvas } = useDraw(drawLine)

  useEffect(() => {
    canvasRef.current!.width = document.body.clientWidth;
    canvasRef.current!.height = document.body.clientHeight;

    window.addEventListener('resize', canvasResize);

    return () => {
      window.removeEventListener('resize', canvasResize);
    }
  }, []);

  const canvasResize = () => {
    redrawCanvas();
  }

  function drawLine ({ctx, currentPoint, prevPoint} : Draw) {
    ctx.beginPath();
    ctx.moveTo(prevPoint!.x, prevPoint!.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return (
    <canvas 
      ref={canvasRef}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(e)}}
      className="w-full h-screen"
    ></canvas>)
};

export default Board;
