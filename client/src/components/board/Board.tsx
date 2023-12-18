"use client";

import { useDraw } from "@/hooks/useDraw";
import { Draw, Point } from "@/types/drawing";
import React, { useEffect } from "react";

const Board: React.FunctionComponent = () => {
  const { canvasRef, onMouseDown } = useDraw(drawLine)

  useEffect(() => {
    canvasRef.current!.width = window.innerWidth;
    canvasRef.current!.height = window.innerHeight;

    window.addEventListener('resize', canvasResize);

    return () => {
      window.removeEventListener('resize', canvasResize);
    }
  }, []);

  const canvasResize = () => {
    canvasRef.current!.width = window.innerWidth;
    canvasRef.current!.height = window.innerHeight;
  }

  function drawLine ({ctx, currentPoint, prevPoint} : Draw) {
    const { x, y }: Point = currentPoint; 
    const lineColor = 'white';
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <canvas 
      ref={canvasRef}
      onMouseDown={onMouseDown}
      className="border border-lime-500"
    ></canvas>)
};

export default Board;
