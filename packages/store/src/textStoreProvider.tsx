'use client'

import { type ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'

import {
    textStore,
  type TextStore,
  type createTextStoreType,
} from './textStore'

export type TextStoreApi = ReturnType<createTextStoreType>

export const TextStoreContext = createContext<TextStoreApi | undefined>(
  undefined,
)

export interface TextStoreProviderProps {
  children: ReactNode
}

export const TextStoreProvider = ({
  children,
}: TextStoreProviderProps) => {
  return (
    <TextStoreContext.Provider value={textStore}>
      {children}
    </TextStoreContext.Provider>
  )
}

export const useTextStore = <T,>(
  selector: (store: TextStore) => T,
): T => {
  const counterStoreContext = useContext(TextStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useTextStore must be used within TextStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}

