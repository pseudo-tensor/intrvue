'use client'

import { type ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'

import {
    codeStore,
  type CodeStore,
  type createCodeStoreType,
} from './codeStore'

export type CodeStoreApi = ReturnType<createCodeStoreType>

export const CodeStoreContext = createContext<CodeStoreApi | undefined>(
  undefined,
)

export interface CodeStoreProviderProps {
  children: ReactNode
}

export const CodeStoreProvider = ({
  children,
}: CodeStoreProviderProps) => {
  return (
    <CodeStoreContext.Provider value={codeStore}>
      {children}
    </CodeStoreContext.Provider>
  )
}

export const useCodeStore = <T,>(
  selector: (store: CodeStore) => T,
): T => {
  const counterStoreContext = useContext(CodeStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCodeStore must be used within CodeStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}

