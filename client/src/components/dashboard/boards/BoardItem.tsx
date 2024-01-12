import { IBoard } from "@/types/board";
import { useRouter } from "next/navigation";

export interface IBoardItemProps {
  board: IBoard
}

export default function BoardItem({ board }: IBoardItemProps) {

  const router = useRouter();

  const openBoard = () => {
    router.push(`/board/${board.id}`);
  }

  return (
    <div className="bg-white px-3 flex flex-col justify-center w-full h-full shadow-sm rounded-lg col-[span_2_/_auto] row-[span_2_/_auto] select-none" onClick={openBoard}>
      <h2 className="truncate">{board.title}</h2>
    </div>
  )
}