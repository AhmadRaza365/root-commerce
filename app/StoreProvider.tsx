'use client';
import { store } from '@/redux/store';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
