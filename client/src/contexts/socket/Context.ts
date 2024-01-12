import { IMessage } from "@/types/message";
import { SocketUser } from "@/types/user";
import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  rid: string;
  users: SocketUser[];
  messages: IMessage[]
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  rid: "",
  users: [],
  messages: []
}

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_rid' | 'update_users' | 'update_messages';
export type TSocketContextPayload = string | SocketUser[] | Socket | IMessage | IMessage[];

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload
}

export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions): ISocketContextState => {
  switch (action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket };
    case 'update_rid':
      return { ...state, rid: action.payload as string };
    case 'update_uid':
      return { ...state, uid: action.payload as string };
    case 'update_users':
      return { ...state, users: action.payload as SocketUser[] };
    case 'update_messages':
      return { ...state, messages: action.payload as IMessage[] };
    default:
      return { ...state };
  }
}

export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
