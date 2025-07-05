import { createStore } from 'zustand/vanilla'
import { sessionDataTsType } from '@repo/types/userTypes';
import { defaultInitState as defaultTextObject } from './textStore';

export type InterviewState = sessionDataTsType;

export type InterviewActions = {
  setInterview: (data: sessionDataTsType) => void
}

export type InterviewStore = InterviewState & InterviewActions;

const initInterviewStore = (): InterviewState => {
  return {
    session_id: "",
    host_id: "",
    participant_id: "",
    status: "",
    date: new Date,
    code_data: "",
    text_data: defaultTextObject
  };
}

const defaultInitState: sessionDataTsType = {
  session_id: "",
  host_id: "",
  participant_id: "",
  status: "",
  date: new Date,
  code_data: "",
  text_data: defaultTextObject
}

const createInterviewStore = (
  initState: InterviewState = defaultInitState
) => {
  return createStore<InterviewStore>()((set) => ({
    ...initState,
    setInterview: (data: sessionDataTsType) => set({
      session_id: data.session_id,
      host_id: data.host_id,
      participant_id: data.participant_id,
      status: data.status,
      date: data.date,
      code_data: data.code_data,
      text_data: data.text_data
    }),
  }));
};

export type createInterviewStoreType = typeof createInterviewStore;

export const interviewStore = createInterviewStore(initInterviewStore());
