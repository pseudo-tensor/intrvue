import "prosemirror-view/style/prosemirror.css";
import "prosemirror-example-setup/style/style.css";
import "prosemirror-menu/style/menu.css";

import { useEffect, useRef } from "react";
import { useTextStore } from '@repo/store/providers/textStoreProvider';
import { Schema } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";

const mySchema = new Schema({
  nodes: addListNodes(baseSchema.spec.nodes, "paragraph block*", "block"),
  marks: baseSchema.spec.marks,
});

export default function TextEditor() {
  const docJSON = useTextStore((s) => s.docJSON);
  const setDocJSON = useTextStore((s) => s.setDocJSON);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    const state = EditorState.create({
      doc: mySchema.nodeFromJSON(docJSON),
      plugins: exampleSetup({ schema: mySchema }),
    });

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        setDocJSON(newState.doc.toJSON());
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  return (
    <div>
      <div ref={editorRef} />
    </div>
  );
}
