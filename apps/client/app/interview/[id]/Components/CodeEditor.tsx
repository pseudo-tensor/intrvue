// TODO: separate out ws connection stuff to lib/hooks

import { drawSelection, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state'
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup, EditorView } from 'codemirror';
import { useRef, useEffect } from 'react';
import { useCodeStore } from '@repo/store/providers/codeStoreProvider';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { javascript } from '@codemirror/lang-javascript';
import { useParams } from 'next/navigation';
import { oneDark } from '@codemirror/theme-one-dark';

const ydoc = new Y.Doc();
const url = process.env.NEXT_PUBLIC_WSURL ?? 'wss://localhost:8080';
console.log(url);
const minLines = 60;
const lineHeight = 1.4;
const fontSize = 14;

export default function CodeEditor() {
  const { code, setCode } = useCodeStore(
    (state) => state,
  )
  const interviewId = useParams<{id: string}>()?.id;
  const editor = useRef<any>(null);
  const valueRef = useRef<string>(code);
  const ytext = ydoc.getText('codemirror');
  const languages = [javascript()];

  useEffect(() => {
    valueRef.current = code;
  }, [code]);

  useEffect(() => {
    // CodeMirror Extension: update code in store
    const provider = new WebsocketProvider(url, interviewId, ydoc);
    const onUpdate = EditorView.updateListener.of((view) => {
      if (view.docChanged) {
        setCode(view.state.doc.toString());
      }
    });
    const codeMirrorOptions = {
      doc: valueRef.current,
      lineNumbers: true,
      drawSelection: true,
      lineWrapping: true, // use a state for this
      autoCloseBrackets: true,
      cursorScrollMargin: 48,
      indentUnit: 2,
      tabSize: 2,
      styleActiveLine: true,
      viewportMargin: 99,
      extensions: [
        [...languages],
        basicSetup,
        oneDark,
        keymap.of(defaultKeymap),
        onUpdate,
        yCollab(ytext, provider.awareness),
        drawSelection(),
        EditorView.theme({
          "&": {
            fontSize: "22px"
          },
          ".cm-content": {
            fontSize: "22px"
          }
        }),
        EditorView.theme({
          "&": {
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight
          },
          ".cm-content": {
            minHeight: `${minLines * fontSize * lineHeight}px`
          },
          ".cm-editor": {
            minHeight: `${minLines * fontSize * lineHeight}px`
          }
        })
      ],
    };

    const startState = EditorState.create(codeMirrorOptions);
    const view = new EditorView({
      state: startState,
      attributes: {
        style: "font-size: 200%; line-height: 1.4;"
      },
      parent: editor.current,
    } as any);

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div className='w-[50vw] h-[100vh] overflow-hidden'> {/* 50% of viewport height */}
      <div ref={editor} className='w-full h-full overflow-auto' />
    </div>
  );
}
