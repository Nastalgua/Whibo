"use client"

import Board from "@/components/board/Board";
import SocketContextComponent from "@/contexts/socket/Component";

export default function BoardPage() {
  return (
    <SocketContextComponent>
      <main className="">
        <Board />
      </main>
    </SocketContextComponent>
  );
}