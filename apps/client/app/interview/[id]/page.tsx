'use client'
import { useRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { EditorState } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror';

export default function Interview() {
  const [code, setCode] = useState('');

  const editor = useRef<any>(null);
  const valueRef = useRef<string>(code);

  const interviewId = useParams<{id: string}>()?.id;

  useEffect(() => {
    valueRef.current = code;
  }, [code]);

  useEffect(() => {
    // CodeMirror Extension: update code in store
    const onUpdate = EditorView.updateListener.of((view) => {
        setCode(view.state.doc.toString());
    });
   const codeMirrorOptions = {
      doc: valueRef.current,
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      cursorScrollMargin: 48,
      indentUnit: 2,
      tabSize: 2,
      styleActiveLine: true,
      viewportMargin: 99,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        onUpdate,
      ],
    };

    const startState = EditorState.create(codeMirrorOptions);

    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });

    return () => {
      view.destroy();
    };
  }, []);


  return (
    <div>
      <h1>Interview ID: {interviewId}</h1>
      <div ref={editor} />
    </div>
  );
}
