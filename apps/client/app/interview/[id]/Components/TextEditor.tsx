// TODO: separate out ws connection stuff to lib/hooks

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
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ySyncPlugin, yCursorPlugin } from 'y-prosemirror';
import { useParams } from "next/navigation";

const mySchema = new Schema({
  nodes: addListNodes(baseSchema.spec.nodes, "paragraph block*", "block"),
  marks: baseSchema.spec.marks,
});

const url = process.env.URL? process.env.URL : 'ws://localhost:8081';

export default function TextEditor() {
  const docJSON = useTextStore((s) => s.docJSON);
  const setDocJSON = useTextStore((s) => s.setDocJSON);
  const interviewId = useParams<{id: string}>()?.id;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Connect to public y-websocket demo server or your own
    const provider = new WebsocketProvider(url, interviewId, ydoc);
    const yXmlFragment = ydoc.getXmlFragment('prosemirror');

    const state = EditorState.create({
      doc: mySchema.nodeFromJSON(docJSON),
      plugins: [
        ySyncPlugin(yXmlFragment),
        yCursorPlugin(provider.awareness),
        ...exampleSetup({ schema: mySchema })
      ]
    });

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(tr) {
        if (viewRef.current) {
          const newState = viewRef.current.state.apply(tr);
          view.updateState(newState);
          setDocJSON(newState.doc.toJSON());
        }
     },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      provider.disconnect();
      ydoc.destroy();
    };

  }, []);

  return (
    <div>
      <div ref={editorRef} />
    </div>
  );
}
