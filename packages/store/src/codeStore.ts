import { createStore } from 'zustand/vanilla'

export type CodeState = {
  code: string
}

export type CodeActions = {
  setCode: (data: string) => void
}

export type CodeStore = CodeState & CodeActions;

const initCodeStore = (): CodeState => {
  return { code: "" }
}

const defaultInitState: CodeState = {
  code: "",
}

const createCodeStore = (
  initState: CodeState = defaultInitState
) => {
  return createStore<CodeStore>()((set) => ({
    ...initState,
    setCode: (data: string) => set({ code: data }),
  }));
};

export type createCodeStoreType = typeof createCodeStore;

export const codeStore = createCodeStore(initCodeStore());
