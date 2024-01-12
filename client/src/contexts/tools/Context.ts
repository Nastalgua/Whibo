import { createContext } from 'react';

export type TToolSelection = 'pen' | 'eraser'

export interface IToolsContextState {
  selectedTool: TToolSelection
}

export const defaultToolsContextState : IToolsContextState = {
  selectedTool: 'pen'
}

export type TToolsContextActions = 'select_tool';
export type TToolsContextPayload = TToolSelection;

export interface IToolContextActions {
  type: TToolsContextActions,
  payload: TToolsContextPayload
}

export const ToolReducer = (state : IToolsContextState, action: IToolContextActions): IToolsContextState => {
  switch (action.type) {
    case 'select_tool':
      return { ...state, selectedTool: action.payload };
    default:
      return { ...state };
  }
}

export interface IToolsContextProps {
  ToolsState: IToolsContextState,
  ToolsDispatch: React.Dispatch<IToolContextActions>;
}

const ToolsContext = createContext<IToolsContextProps>({
  ToolsState: defaultToolsContextState,
  ToolsDispatch: () => {}
});

export const ToolContextConsumer = ToolsContext.Consumer;
export const ToolContextProvider = ToolsContext.Provider;

export default ToolsContext;
