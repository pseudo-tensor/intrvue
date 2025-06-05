import { codeStore } from "@repo/store/stores/codeStore";
import { textStore } from "@repo/store/stores/textStore";

export const logCodeData = () => {
  console.log(codeStore.getState().code);
}

export const logTextData = () => {
  console.log(textStore.getState().docJSON);
}
