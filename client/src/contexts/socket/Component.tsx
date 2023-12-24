"use client"

import { PropsWithChildren, ReactNode, useEffect, useReducer, useRef } from "react";
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from "./Context";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { usePathname } from 'next/navigation';

import { v4 as uuidv4 } from 'uuid';
import { Socket } from "socket.io-client";
import { IUser } from "@/types/user";

export interface ISocketContextComponentProps extends PropsWithChildren {
  children: ReactNode
}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);

  const { rid } = useParams(); // get the current [rid] from path

  const socket = useSocket(process.env.NEXT_PUBLIC_SERVICE_URL!, { 
    reconnectionAttempts: 5, 
    reconnectionDelay: 5000, 
    autoConnect: false,
    query: { 
      rid, 
      // TODO: replace empty strings with user authentication
      uid: "",
      uUsername: "",
    }
  });

  useEffect(() => {
    socket.connect();
    
    SocketDispatch({ type: 'update_socket', payload: socket as Socket });

    SocketDispatch({ type: 'update_rid', payload: rid as string });

    startListeners(); 

    sendHandshake();

    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
    }
  }, []);

  const startListeners = () => {
    socket.on("user-connected", (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users });
    });

    socket.on("user-disconnected", (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users });
    });
  }

  const sendHandshake = () => {
    socket.emit("handshake", (uid: string, users: IUser[]) => {
      // if someone anonymous joins the server, we still need to give that person a user id
      SocketDispatch({ type: 'update_uid', payload: uid });

      // get users already in the room
      SocketDispatch({ type: 'update_users', payload: users });
    });
  }

  return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>
}

export default SocketContextComponent;