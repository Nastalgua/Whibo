"use client"

import { useContext } from "react";
import OverlayItem from "../overlayItem/OverlayItem";
import UserItem from "./user/UserItem";
import SocketContext from "@/contexts/socket/Context";
import { IUser, SocketUser } from "@/types/user";

export default function Share() {
  const { users } = useContext(SocketContext).SocketState

  const share = () => {
    console.log("Missing share implementation.");
  }

  return (
    <OverlayItem className="top-0 right-0 p-2">
      <div className="flex gap-1.5">
        {users.map((user: SocketUser) => <UserItem key={user.uid} user={user} />)}
        {/* <button 
          className="bg-dark-jungle-green text-white px-3 py-0.5 rounded-sm"
          onClick={share}
        >Share</button> */}
      </div>
    </OverlayItem>
  );
}