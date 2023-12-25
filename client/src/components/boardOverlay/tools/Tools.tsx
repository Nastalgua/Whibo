import { useContext } from "react";
import OverlayItem from "../overlayItem/OverlayItem";
import ToolItem from "./toolItem/ToolItem";
import ToolsContext from "@/contexts/tools/Context";

export default function Tools() {
  const { selectedTool } = useContext(ToolsContext).ToolsState;

  return (
    <OverlayItem className="top-1/2 p-2">
      <div className="flex flex-col gap-2">
        <ToolItem active={selectedTool === 'pen'} icon="🖊️" type="pen" />
        <ToolItem active={selectedTool === 'eraser'} icon="🧼" type="eraser" />
      </div>
    </OverlayItem>
  );
}