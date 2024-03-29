"use client";

import SocketContext from "@/contexts/socket/Context";
import { useDraw } from "@/hooks/useDraw";
import { IBoard } from "@/types/board";
import { Draw, SharedDraw } from "@/types/drawing";
import React, { useContext, useEffect } from "react";

const Board = ({ board, boardId }: { board: IBoard, boardId: string }) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { canvasRef, onMouseDown, redrawCanvas, addNewLine, removeLine, eraserRadius } = useDraw(createLine, deleteLine, boardId);

  useEffect(() => {
    if (!socket) return;

    const ctx = canvasRef.current?.getContext('2d');
    canvasRef.current!.width = document.body.clientWidth;
    canvasRef.current!.height = document.body.clientHeight;

    var image = new Image();
    image.src = board.content;
    image.onload = function() {
      ctx!.drawImage(image, 0, 0);
    };

    window.addEventListener('resize', canvasResize);

    socket!.on("draw-line", ({ currentPoint, prevPoint, color } : SharedDraw) => {
      if (!ctx) return console.log("Missing canvas context...");
      const line = { prevPoint, currentPoint, ctx, color };
      drawLine(line);
      addNewLine(line);
    });

    socket!.on("undraw-line", ({ currentPoint, prevPoint, color } : SharedDraw) => {
      if (!ctx) return console.log("Missing canvas context...");
      const line = { prevPoint, currentPoint, ctx, color };
      undrawLine(line);
      removeLine(line);
    });

    return () => {
      window.removeEventListener('resize', canvasResize);
      socket.off("draw-line");
      socket.off("undraw-line");
    }
  }, [socket]);

  const canvasResize = () => {
    const ctx = canvasRef.current?.getContext('2d');

    var image = new Image();
    image.src = board.content;
    image.onload = function() {
      ctx!.drawImage(image, 0, 0);
    };

    redrawCanvas();
  }

  function drawLine ({ctx, currentPoint, prevPoint, color} : Draw) {
    ctx.globalCompositeOperation="source-over";
    ctx.beginPath();
    ctx.moveTo(prevPoint!.x, prevPoint!.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function undrawLine({ ctx, prevPoint, currentPoint, color }: Draw) {
    ctx.globalCompositeOperation="destination-out";
    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, eraserRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function createLine({ctx, currentPoint, prevPoint, color} : Draw, emit: boolean) {
    if (emit) { socket!.emit('draw-line', {prevPoint, currentPoint, color}); }
    drawLine({ctx, currentPoint, prevPoint, color});
  }

  function deleteLine({ ctx, prevPoint, currentPoint, color } : Draw, emit: boolean) {
    if (emit) { socket!.emit('undraw-line', { prevPoint }); }
    undrawLine({ ctx, prevPoint, currentPoint, color });
  }

  return (
    <div className="w-full h-screen">
      <canvas
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => { e.preventDefault(); onMouseDown(e)}}
        className="w-full h-full bg-slate-50 bg-dots overflow-scroll"
      ></canvas>
    </div>
  )
};

export default Board;
