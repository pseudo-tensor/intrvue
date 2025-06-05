import { codeStore } from "@repo/store/stores/codeStore";
import { textStore } from "@repo/store/stores/textStore";

export const updateTextExternally = () => {
  const newDoc = {
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Updated externally!' }] },
    ],
  };

  textStore.getState().setDocJSON(newDoc);
}

export const updateCodeExternally = () => {
  const text = "updated externally";

  codeStore.getState().setCode(text);
}
