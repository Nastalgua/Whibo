"use client"

import { useEffect } from "react";
import { useParams } from 'next/navigation';

import Board from "@/components/board/Board";
import BoardOverlay from "@/components/boardOverlay/BoardOverlay";
import SocketContextComponent from "@/contexts/socket/Component";
import ToolContextComponent from "@/contexts/tools/Component";
import { IBoard } from "@/types/board";

export default function BoardPage() {
  const params = useParams();

  useEffect(() => {
    const getBoard = async () => {
      const boardId = params.rid as string;
      const queryParams = {
        board_id: boardId
      }
  
      const queryString = new URLSearchParams(queryParams).toString();

      try {
        const res = await fetch(`/api/v1/boards/board-info?${queryString}`);
        const board: IBoard = (await res.json()).board;

        if (board) {
          console.log("This board exists already.");
          console.log(board);
        } else {
          console.log("Couldn't find a existing board");
          console.log(board);
        }
      } catch (err) {
        console.log(err);
      }
      
    }

    getBoard();
  }, []);

  return (
    <SocketContextComponent>
      <ToolContextComponent>
        <main>
          <BoardOverlay />
          <Board />
        </main>
      </ToolContextComponent>
    </SocketContextComponent>
  );
}