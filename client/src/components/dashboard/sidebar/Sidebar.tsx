import SidebarItem from "./SidebarItem";

export enum TSidebarState {
  BOARDS,
  SETTINGS,
  ARCHIVES
}

interface ISidebarProps {
  updateCurrentState (state: TSidebarState) : void
}

export default function Sidebar({ updateCurrentState } : ISidebarProps) {
  return (
    <nav className="bg-slate-50 w-36 min-h-screen border-r-2 ">
      <ul>
        <SidebarItem name="Boards" updateState={() => updateCurrentState(TSidebarState.BOARDS)} />
        <SidebarItem name="Settings" updateState={() => updateCurrentState(TSidebarState.SETTINGS)} />
        <SidebarItem name="Archives" updateState={() => updateCurrentState(TSidebarState.ARCHIVES)} />
      </ul>
    </nav>
  );
}