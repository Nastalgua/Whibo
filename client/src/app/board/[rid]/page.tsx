"use client"

import Board from "@/components/board/Board";
import BoardOverlay from "@/components/boardOverlay/BoardOverlay";
import SocketContextComponent from "@/contexts/socket/Component";
import ToolContextComponent from "@/contexts/tools/Component";

export default function BoardPage() {
  return (
    <SocketContextComponent>
      <ToolContextComponent>
        <main className="">
          <BoardOverlay />
          <Board />
        </main>
      </ToolContextComponent>
    </SocketContextComponent>
  );
}