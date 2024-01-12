import SidebarItem from "./SidebarItem";

import logout from "../../../../public/logout.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export enum TSidebarState {
  BOARDS,
  SETTINGS,
  ARCHIVES
}

interface ISidebarProps {
  updateCurrentState (state: TSidebarState) : void
}

export default function Sidebar({ updateCurrentState } : ISidebarProps) {

  const router = useRouter();

  const onClick = async () => {
    const res = await fetch(`/api/v1/auth/logout`);
    const success = (await res.json()).logoutSuccess;

    if (success) {
      router.push("/");
    }
  }

  return (
    <nav className="bg-slate-50 w-36 min-h-screen border-r-2 flex flex-col-reverse items-center pb-10">
      <div className="cursor-pointer" onClick={onClick}>
        <Image height={32} width={32} src={logout} alt="" />
      </div>
      
      {/* <ul className="h-full">
        <SidebarItem name="Boards" updateState={() => updateCurrentState(TSidebarState.BOARDS)} />
        <SidebarItem name="Settings" updateState={() => updateCurrentState(TSidebarState.SETTINGS)} />
        <SidebarItem name="Archives" updateState={() => updateCurrentState(TSidebarState.ARCHIVES)} />
      </ul> */}
    </nav>
  );
}