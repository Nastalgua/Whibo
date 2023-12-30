import { IUser } from "@/types/user";
import { setCookie } from "cookies-next";
import { createContext } from "react";

export interface IAuthContextState {
  user: IUser | undefined
}

export const defaultAuthContextState: IAuthContextState = {
  user: undefined
}

export type TAuthContextActions = 'login' | 'register' | 'logout';

export type TAuthContextPlayload = IUser | undefined;

export interface IAuthContextActions {
  type: TAuthContextActions,
  payload: TAuthContextPlayload
}

export const AuthReducer = (state: IAuthContextState, action: IAuthContextActions): IAuthContextState => {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload as IUser };
    case 'register':
      return { ...state, user: action.payload as IUser };
    case 'logout': 
      return { ...state, user: undefined };
    default:
      return { ...state };
  }
}

export interface IAuthContextProps {
  AuthState: IAuthContextState,
  AuthDispatch: React.Dispatch<IAuthContextActions>;
}

const AuthContext = createContext<IAuthContextProps>({
  AuthState: defaultAuthContextState,
  AuthDispatch: () => {}
});

export const AuthContextConsumer = AuthContext.Consumer;
export const AuthContextProvider = AuthContext.Provider;

export default AuthContext;