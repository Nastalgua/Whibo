"use client"

import { store } from './store';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';

export default function ReduxProvider({ children }: PropsWithChildren) {
  return (<Provider store={store}>{ children }</Provider>);
}