"use client"

import { useContext, useEffect, useRef } from "react";
import OverlayItem from "../overlayItem/OverlayItem";
import SocketContext from "@/contexts/socket/Context";
import { IUser, SocketUser } from "@/types/user";
import { IBoard } from "@/types/board";
import debounce from "debounce";

export default function Name({board} : {board : IBoard}) {

  const input = useRef(null); 

  useEffect(() => {
    (input.current! as HTMLInputElement).value = board.title;
  }, []);

  const handleInputChange = async () => {
    const value = (input.current! as HTMLInputElement).value;

    // Add your custom logic or callback here

    const queryParams = {
      board_id: board.id,
      title: value
    }

    try {
      const res = await fetch(`/api/v1/boards/update-title`, { 
        method: 'POST',
        body: JSON.stringify(queryParams),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const updated: boolean = (await res.json()).updated;

      if (updated) {
        console.log("Updated the board in database.");
      }
      
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <OverlayItem className="top-0 left-0 p-2">
      <div className="flex gap-1.5">
        <input className="outline-none" ref={input} onChange={debounce(handleInputChange, 2000, { immediate: false })} />
      </div>
    </OverlayItem>
  );
}