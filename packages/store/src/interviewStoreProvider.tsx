'use client'

import { type ReactNode, createContext, useContext } from 'react'
import { useStore } from 'zustand'

import {
    interviewStore,
  type InterviewStore,
  type createInterviewStoreType,
} from './interviewStore'

export type InterviewStoreApi = ReturnType<createInterviewStoreType>

export const InterviewStoreContext = createContext<InterviewStoreApi | undefined>(
  undefined,
)

export interface InterviewStoreProviderProps {
  children: ReactNode
}

export const InterviewStoreProvider = ({
  children,
}: InterviewStoreProviderProps) => {
  return (
    <InterviewStoreContext.Provider value={interviewStore}>
      {children}
    </InterviewStoreContext.Provider>
  )
}

export const useInterviewStore = <T,>(
  selector: (store: InterviewStore) => T,
): T => {
  const counterStoreContext = useContext(InterviewStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useInterviewStore must be used within InterviewStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}

