"use client";

import SocketContext from "@/contexts/socket/Context";
import { useDraw } from "@/hooks/useDraw";
import { Draw, SharedDraw } from "@/types/drawing";
import React, { useContext, useEffect } from "react";

const Board: React.FunctionComponent = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const { canvasRef, onMouseDown, redrawCanvas, addNewLine } = useDraw(createLine);

  useEffect(() => {
    if (!socket) return;

    const ctx = canvasRef.current?.getContext('2d');
    canvasRef.current!.width = document.body.clientWidth;
    canvasRef.current!.height = document.body.clientHeight;

    window.addEventListener('resize', canvasResize);

    socket!.on("draw-line", ({ currentPoint, prevPoint, color } : SharedDraw) => {
      if (!ctx) return console.log("Missing canvas context...");
      const line = { prevPoint, currentPoint, ctx, color };
      drawLine(line);
      addNewLine(line);
    });

    return () => {
      window.removeEventListener('resize', canvasResize);
      socket.off("draw-line");
    }
  }, [socket]);

  const canvasResize = () => {
    redrawCanvas();
  }

  function drawLine ({ctx, currentPoint, prevPoint, color} : Draw) {
    ctx.beginPath();
    ctx.moveTo(prevPoint!.x, prevPoint!.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function createLine({ctx, currentPoint, prevPoint, color} : Draw, emit: boolean) {
    if (emit) { socket!.emit('draw-line', {prevPoint, currentPoint, color}); }
    drawLine({ctx, currentPoint, prevPoint, color});
  }

  return (
    <canvas
      ref={canvasRef}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(e)}}
      className="w-full h-screen bg-dots"
    ></canvas>)
};

export default Board;
