import { PropsWithChildren, ReactNode, useReducer } from "react"
import { AuthContextProvider, AuthReducer, defaultAuthContextState } from "./Context";
import { useUser } from "@/hooks/useUser";

export interface IAuthContextComponentProps extends PropsWithChildren {
  children: ReactNode
}

const AuthContextComponent: React.FunctionComponent<IAuthContextComponentProps> = (props) => {
  const { children } = props;

  const [AuthState, AuthDispatch] = useReducer(AuthReducer, defaultAuthContextState);

  const user = useUser();

  if (user && !AuthState.user) AuthDispatch({ type: 'login', payload: user });

  return <AuthContextProvider value={{ AuthState, AuthDispatch }}>{ children }</AuthContextProvider>;
}

export default AuthContextComponent;