import { IBoard } from "@/types/board";
import Share from "./share/Share";
import Tools from "./tools/Tools";
import Name from "./name/Name";

export default function BoardOverlay({board} : {board : IBoard}) {
  return (
    <div className="fixed w-full h-full p-6 pointer-events-none">
      <div className="relative w-full h-full">
        <Share />
        <Tools />
        <Name board={board} />
      </div>
    </div>
  );
}