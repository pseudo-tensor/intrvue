import { codeStore } from "@repo/store/storecodeStore";

export const logCodeData = () => {
  console.log(codeStore.getState().code);
}
