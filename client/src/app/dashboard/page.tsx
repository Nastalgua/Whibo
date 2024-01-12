"use client"

import Boards from "@/components/dashboard/boards/Boards";
import Settings from "@/components/dashboard/settings/Settings";
import Sidebar, { TSidebarState } from "@/components/dashboard/sidebar/Sidebar";
import requiredAuth from "@/components/protectedRoute/RequiredAuth";
import { useState } from "react";

export default requiredAuth(function Home() {
  const [currentState, setCurrentState] = useState<TSidebarState>(TSidebarState.BOARDS);

  const updateCurrentState = (state: TSidebarState) => {
    setCurrentState(state);
  }

  const Content = () => {
    switch (currentState) {
      case TSidebarState.BOARDS:
        return <Boards />
      case TSidebarState.SETTINGS:
        return <Settings />
      default:
        return null
    }
  }

  return (
    <div className="flex">
      <Sidebar updateCurrentState={updateCurrentState} />
      <Content />
    </div>
  );
});