import { createStore } from 'zustand/vanilla'
import { type Schema as schemaType, Schema, Node as ProseMirrorNode } from 'prosemirror-model';
import { schema as baseSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";

export type TextState = {
  docJSON: ReturnType<ProseMirrorNode['toJSON']>;
}

export type TextActions = {
  setDocJSON: (data: any) => void
}

export type TextStore = TextState & TextActions;

// export const mySchema: schemaType = new Schema({
const mySchema = new Schema({
  nodes: addListNodes(baseSchema.spec.nodes, "paragraph block*", "block"),
  marks: baseSchema.spec.marks,
});

const defaultInitState: TextState = {
  docJSON: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  }
};

const initTextStore = (): TextState => {
  return {
    docJSON: mySchema.topNodeType.createAndFill()!.toJSON(),
  };
};

const createTextStore = (
  initState: TextState = defaultInitState
) => {
  return createStore<TextStore>()((set) => ({
    ...initState,
    setDocJSON: (data) => set({ docJSON: data }),
  }));
};

export type createTextStoreType = typeof createTextStore;

export const textStore = createTextStore(initTextStore());
