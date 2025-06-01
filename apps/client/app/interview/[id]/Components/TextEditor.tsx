import "prosemirror-view/style/prosemirror.css";
import "prosemirror-example-setup/style/style.css";
import "prosemirror-menu/style/menu.css";

import { EditorState } from "prosemirror-state"
import { EditorView } from 'prosemirror-view';
import { Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import { useEffect, useRef, useState } from "react"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

export default function TextEditor() {
  const editor = useRef<any>(null);

  useEffect(() => {
    const proseMirrorOptions = {
      doc: mySchema.topNodeType.createAndFill()!,
      plugins: exampleSetup({schema: mySchema})
    };

    const startState = EditorState.create(proseMirrorOptions);

    const view = new EditorView(editor.current, {
      state: startState,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });

    return () => view.destroy();

  },[])

  return (
    <div ref={editor}/>
  )
}
