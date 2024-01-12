"use client"

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

import Board from "@/components/board/Board";
import BoardOverlay from "@/components/boardOverlay/BoardOverlay";
import SocketContextComponent from "@/contexts/socket/Component";
import ToolContextComponent from "@/contexts/tools/Component";
import { IBoard } from "@/types/board";

import { useRouter } from 'next/navigation';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();

  const [board, setBoard] = useState<IBoard | null>(null);

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
          setBoard(board);
        } else {
          console.log("Couldn't find a existing board");
          router.push('/dashboard');
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
        {!board ? <div className="w-full h-screen bg-white absolute z-20 flex justify-center items-center">
          <div>
            Loading...
          </div>
        </div> : <main>
          <BoardOverlay board={board} />
          <Board board={board} boardId={params.rid as string} />
        </main>
        }
      </ToolContextComponent>
    </SocketContextComponent>
  );
}