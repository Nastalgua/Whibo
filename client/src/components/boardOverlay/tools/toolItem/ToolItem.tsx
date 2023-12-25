import ToolsContext, { TToolSelection } from "@/contexts/tools/Context";
import { useContext } from "react";

type ToolProps = {
  active: boolean,
  icon: string,
  type: TToolSelection
}

export default function ToolItem({ active, icon, type }: ToolProps) {
  const ToolsDispatch = useContext(ToolsContext).ToolsDispatch;

  const changeTools = (tool: TToolSelection) => {
    ToolsDispatch({ type: 'select_tool', payload: tool });
  }

  return (
    <div 
      className={`transition ease-in-out p-2 cursor-pointer rounded-md ${active ? 'bg-red-100' : 'hover:bg-gray-300'}`} 
      onClick={() => changeTools(type)}>{icon}</div>
  );
}