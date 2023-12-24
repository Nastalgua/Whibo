"use client"

import Board from "@/components/board/Board";
import SocketContextComponent from "@/contexts/socket/Component";
import { useEffect } from "react";

export default function BoardPage({ params }: {params: {rid: string}}) {
  useEffect(() => {}, []);

  return (
    <SocketContextComponent>
      <main className="">
        <Board/>
      </main>
    </SocketContextComponent>
  );
}