import { PropsWithChildren, ReactNode, useReducer } from "react";
import { ToolContextProvider, ToolReducer, defaultToolsContextState } from "./Context";

export interface IToolContextComponentProps extends PropsWithChildren {
  children: ReactNode
}

const ToolsContextComponent: React.FunctionComponent<IToolContextComponentProps> = (props) => {
  const { children } = props;

  const [ToolsState, ToolsDispatch] = useReducer(ToolReducer, defaultToolsContextState);

  return <ToolContextProvider value={{ ToolsState, ToolsDispatch }}>{ children }</ToolContextProvider>;
}

export default ToolsContextComponent;