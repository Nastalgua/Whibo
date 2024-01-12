import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import BoardItem from "./BoardItem";
import { IBoard } from "@/types/board";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const montserratBold = Montserrat({ weight: ['700'], subsets: ['latin'], display: 'swap' });

export default function Boards() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.authReducer.value.user);

  const router = useRouter();

  const [boards, setBoards] = useState<IBoard[]>([]);

  useEffect(() => {
    const getBoards = async () => {
      const queryParams = {
        user_id: user!.id,
      }
  
      const queryString = new URLSearchParams(queryParams).toString();
  
      try {
        const res = await fetch(`/api/v1/boards/own-boards?${queryString}`);
        const boards: IBoard[] = (await res.json()).boards;
        setBoards(boards);
      } catch (err) {
        console.log(err);
      }
    }

    getBoards();
  }, []);

  const createBoard = async () => {
    const queryParams = {
      user_id: user!.id,
    }

    const queryString = new URLSearchParams(queryParams).toString();

    try {
      const res = await fetch(`/api/v1/boards/create-board?${queryString}`, { method: 'POST' });
      const board: IBoard = (await res.json()).board;

      router.push(`/board/${board.id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-slate-50 bg-dots px-8 py-3 h-screen w-full">
      <title>Boards</title>
      <div className="flex flex-col">
        <div className=" inline-flex items-center mb-2">
          <h2 className={`text-4xl font-semibold text-center block mr-2 ${montserratBold.className}`}>Boards</h2>
          <button className={`text-sm bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded text-center ${montserratBold.className}`} onClick={createBoard}>Create</button>
        </div>
        <div className="h-full w-full grid gap-2 grid-cols-boards-gallery auto-rows-boards-gallery">
          {
            boards.map((board) => <BoardItem board={board} key={board.id} />)
          }
        </div>
      </div>
    </div>
  );
}